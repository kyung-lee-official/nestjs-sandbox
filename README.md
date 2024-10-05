# Examples for nestjs Official Docs

https://docs.nestjs.com/

## Authorization Strategy

Authorization strategies can be complex, this document aims to provide a flexible and scalable authorization solution that combines hierarchical RBAC (Role Based Access Control) and ABAC (Attribute Based Access Control).

Let's take a company as an example. Say a company has multiple departments, each department has multiple teams, and each team has multiple employees. The company has multiple resources, and each resource has multiple actions.

The definition of the company's position is as follows:

```ts
type Role = {
	name: string;
	parent: string | null;
	/* attribute `members` is for illustration purpose only, in real world, it's recommended to use many-to-many relationship */
	members: string[];
	"children-roles": Role[];
};

const role: Role[] = [
	{
		name: "admin",
		parent: null,
		members: ["Bob"],
		"children-roles": [
			{
				name: "chief-secretary",
				parent: "admin",
				members: ["Alice"],
				"children-roles": [],
			},
			{
				name: "vice-president",
				parent: "admin",
				members: ["David"],
				"children-roles": [],
			},
			{
				name: "chief-hr",
				parent: "admin",
				members: ["Charlie"],
				"children-roles": [
					{
						name: "hr",
						parent: "chief-hr",
						members: [],
						"children-roles": [
							{
								name: "hr-bp",
								parent: "hr",
								members: ["Eve", "Frank"],
								"children-roles": [],
							},
							{
								name: "hr-team-1-manager",
								parent: "hr",
								members: ["Grace"],
								"children-roles": [
									{
										name: "hr-team-1",
										parent: "hr-team-1-manager",
										members: ["Helen", "Henry"],
										"children-roles": [],
									},
								],
							},
							{
								name: "hr-team-2-manager",
								parent: "hr",
								members: ["Ian"],
								"children-roles": [
									{
										name: "hr-team-2",
										parent: "hr-team-2-manager",
										members: ["Ivy", "Isaac"],
										"children-roles": [],
									},
								],
							},
						],
					},
				],
			},
			{
				name: "cfo",
				parent: "admin",
				members: ["Iris"],
				"children-roles": [
					{
						name: "finance",
						parent: "cfo",
						members: [],
						"children-roles": [
							{
								name: "accounting-manager",
								parent: "finance",
								members: ["Jack"],
								"children-roles": [
									{
										name: "accounting",
										parent: "accounting-manager",
										members: ["Jane", "Joe"],
										"children-roles": [],
									},
								],
							},
						],
					},
				],
			},
			{
				name: "cto",
				parent: "admin",
				members: ["Kevin"],
				"children-roles": [
					{
						name: "vp-of-engineering",
						parent: "cto",
						members: ["Lily"],
						"children-roles": [],
					},
					{
						name: "engineering",
						parent: "cto",
						members: ["Daniel", "Daisy", "Dora"],
						"children-roles": [],
					},
				],
			},
		],
	},
];
```

There are two typical forms of resources when dealing with data models in a system:

Dynamic resources, where `Resource` is considered as a highly abstract model and is hard-coded, you're allowed to define different types of resources as actual models at runtime based on the abstract model `Resource`, then you create instances of these models. This form is adopted by [Strapi](https://docs.strapi.io/).

Static resources, where you don't have the `resource` concept to be explicitly defined in your code, instead, you hard-code different types of resources in your code directly as models, such as `Payroll`, `Performance`, etc. This form is adopted by [Prisma](https://www.prisma.io/).

In this document, we will focus on the static resources form.

## Basic RBAC

Say we have roles `admin`, `cfo`, and `accounting` (roles should be as granular as possible, even the role is only for one person), and resources `Payroll`.

Each instance of resource `Payroll` should only be scoped by roles `admin`, `cfo`, and `accounting`, note that we're not saying whether resource type `Payroll` can be accessed by certain roles, but whether a specific instance of resource `Payroll` can be accessed by certain roles.

Therefore, for whatever type of resource, we should have a `roles: Role[]` attribute to specify which roles can access the resource.

The model of resource `Payroll` can be defined as follows:

```ts
type Payroll = {
	id: number;
	roles: Role[];
};
```

An instance of resource `Payroll` can be defined as follows:

```json
{
	"id": 1,
	"roles": ["admin", "cfo", "accounting"]
}
```

## Hierarchical RBAC

Based on the rule we established previously that roles should be as granular as possible, each person should have at least one role. With this in mind, we can create hierarchical relationships between roles by adding a `parent: Role` attribute to roles. This is where ABAC comes to help.

> Essentially, ABAC is a model that defines access control based on **attributes** of the users(subjects), resources, actions, and environment. **Policies** (rules) are defined based on these attributes.
>
> https://www.permit.io/blog/how-to-implement-abac

Roles can now be connected in a tree structure.

The model of role can be defined as follows:

```ts
type Role = {
	id: number;
	name: string;
	parent: Role | null;
};
```

An instance of role can be defined as follows:

```json
{
	"id": 1,
	"name": "admin",
	"parent": null
}
```

```json
{
	"id": 2,
	"name": "cfo",
	"parent": 1
}
```

The key feature we want to achieve is by implementing hierarchical RBAC, as the parent of role `cfo` and role `cto`, role `admin` should have access to resource `Performance` of theirs automatically. This requires adding an attribute `superior: boolean` to resources, adding this to resource allows us to decouple the hierarchical business logic from the role model, keep the role model neat and simple, yet still achieve the hierarchical RBAC.

For example, some resource `Performance`'s `roles` attribute could be `['cfo']`, and some could be `['cto']`, and with `superior: true`, as parent role, `admin` should have access to both of them.

The model of resource `Performance` can be defined as follows:

```ts
type Performance = {
	id: number;
	roles: Role[];
	superior: boolean;
};
```

An instance of resource `Performance` can be defined as follows:

```json
{
	"id": 1,
	"roles": ["cfo"],
	"superior": true
}
```

Still we have one last challenge, at the lowest level of the hierarchy, suppose we have a role `engineering`, in which we have multiple engineers, and each engineer should have access to their own `Performance` resource, while they should not have access to other engineers' `Performance` resource. We cannot add a role to each engineer just for this purpose as it dramatically increase the number of roles and the complexity of the system.

In nature, we're talking about if a resource should be private or public for owner's peers within a role. This can be achieved by adding an attribute `peer: boolean` to resources. Then we can say, for resource `Performance`, it should be `peer: true` (again, we're not talking about the resource type, but the instance of the resource, however, when defining a new resource type, you could hardcode this attribute to apply it to every instance of the resource type if needed).

| superior | peer  | superiors | peers | self |
| -------- | ----- | --------- | ----- | ---- |
| true     | false | yes       | yes   | yes  |
| false    | true  | no        | no    | yes  |
| false    | false | no        | yes   | yes  |
| true     | true  | yes       | no    | yes  |

The model of resource `Performance` can be defined as follows:

```ts
type Performance = {
	id: number;
	roles: Role[];
	superior: boolean;
	peer: boolean;
};
```

At this point, we actually introduced a new access control model, which is relationship-based access control (ReBAC), where access control is based on the relationship between subjects.

We will soon encounter an issue that if try to translate the rule using [CASL](https://casl.js.org/v6/en)'s syntax based on ([Prisma WhereInput](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#where)), we will find it's not possible to express the rule. Because we need to check whether the requester's role is a superior of the resource's role recursively, which is not supported by Prisma's WhereInput.

```ts
export class CaslAbilityFactory {
	constructor(private readonly prismaService: PrismaService) {}

	async defineAbilityFor(requester: Member): Promise<AppAbility> {
		const { can, cannot, build } = new AbilityBuilder<AppAbility>(
			createPrismaAbility
		);

		can(Actions.READ, "Performance", {
			where: {
				AND: [
					/* is superior */
					{
						roles: {
							some: {
								/* ??? */
								/* You can't express recursive query here */
							},
						},
					},
				],
			},
		});

		const ability = build();
		return ability;
	}
}
```

CASL is therefore not suitable for this scenario, and the terrible thing is there is no library that can handle such a complex authorization strategy. We have to implement our own authorization strategy, and NestJS's Guard is a good place to start.
