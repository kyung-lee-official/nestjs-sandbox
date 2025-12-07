import { GridPattern1 } from "./GridPattern1";
import { GridPattern2 } from "./GridPattern2";

const Page = () => {
	return (
		<div className="flex flex-col max-w-[932px] p-4 mx-auto gap-8">
			<div
				className="flex flex-col w-full gap-4
				bg-neutral-200"
			>
				<div>This Pattern uses grid only.</div>
				<GridPattern1 />
			</div>
			<div
				className="flex flex-col w-full gap-4
				bg-neutral-200"
			>
				<div>
					<p>
						This Pattern mixes flexbox (for &apos;lg&apos;:
						&apos;1024px&apos;) and grid.
					</p>
					<p>
						<a
							href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout#fixed_and_flexible_track_sizes"
							className="underline"
						>
							unit: fr
						</a>
					</p>
					<p>
						<a
							href="https://developer.mozilla.org/en-US/docs/Web/CSS/repeat"
							className="underline"
						>
							repeat
						</a>
					</p>
				</div>
				<GridPattern2 />
			</div>
		</div>
	);
};

export default Page;
