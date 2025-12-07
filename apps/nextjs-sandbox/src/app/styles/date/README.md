# Time consistency

## Working with Timezone

When dealing with time, you should always assume that server only accepts UTC time, because the server side does not know Let us say your timezone is UTC+8, and an entity is created at 2025-01-01 01:00:00 (local), the corresponding UTC time in database will be 2024-12-31T17:00:00.000Z, if your try to search entities created in year 2025, you are actually searching entities created at 2024-12-31T16:00:00.000Z to 2025-12-31T15:59:59.999Z, which gives you correct results based on your timezone.the timezone of the client.

Time inconsistency could happen when referring to a time range instead of a specific time. For example, year and month.

Let us say your timezone is UTC+8, and an entity is created at 2025-01-01 01:00:00 (local), the corresponding UTC time in database will be 2024-12-31T17:00:00.000Z, if your try to search entities created in year 2025, you are actually searching entities created at 2024-12-31T16:00:00.000Z to 2025-12-31T15:59:59.999Z, which gives you correct results based on your timezone.

That is to say, when searching entities within a time range, you should always specify the start and end time before sending the request. Because the frontend knows the timezone of the user, while the backend does not.

You cannot say "hey server, give me entities created in year 2025", because the <b>server does not know your timezone</b>.

## Where Timezone Needs to Be Ignored

There is another scenario to consider, where we do not care about the timezone, for example, our timezone is UTC+8, we want to create an entity for each month. Essentially time is always UTC, it is just represented in your local time
depending on your timezone.

The <code>toISOString()</code> method of dayjs will always return the UTC time, while the <code>format()</code> method will return the local. With this in mind, we can simply turns the <code>date</code> (<code>2024-12-31T16:00:00.000Z</code>) from month picker into string <code>2025-01-01</code> by calling

```ts
date.format("YYYY-MM-DD"); /* 2025-01-01 */
```

This string should be used as the identifier of the entity when sending requests to the server. When saving to database, we convert the string to a UTC time by calling

```ts
dayjs("2025-01-01").toISOString(); /* 2025-01-01T00:00:00.000Z */
```

which makes it easy for time comparison (filtering).

When it comes to searching, we literally repeat the similar thing. So if we wants all entities of year 2025, we first send string "2025-01-01" to the server, and the server will convert it to "2025-01-01T00:00:00.000Z" before querying the database.
