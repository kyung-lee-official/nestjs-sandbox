"use client";

import { Group } from "@visx/group";
import { hierarchy, stratify, Treemap, treemapSquarify } from "@visx/hierarchy";
import { TileMethod } from "@visx/hierarchy/lib/types";
import shakespeare, {
  Shakespeare,
} from "@visx/mock-data/lib/mocks/shakespeare";
import { scaleLinear } from "@visx/scale";

// const verticalMargin = 120;

// export const color1 = "#f3e9d2";
// const color2 = "#4281a4";
// export const background = "#114b5f";

// const rawData = shakespeare.slice(0, 20);
// console.log(rawData);

// const colorScale = scaleLinear<string>({
// 	domain: [0, Math.max(...rawData.map((d) => d.size ?? 0))],
// 	range: [color2, color1],
// });

// const stratifiedData = stratify<Shakespeare>()
// 	.id((d) => d.id)
// 	.parentId((d) => d.parent)(rawData)
// 	.sum((d) => d.size ?? 0);

// const tileMethods: { [tile: string]: TileMethod<typeof stratifiedData> } = {
// 	treemapSquarify,
// };

const defaultMargin = { top: 10, left: 10, right: 10, bottom: 10 };

export function Content() {
  return (
    <div>
      This component reports an error Read more:
      https://nextjs.org/docs/messages/prerender-error Error: multiple roots
    </div>
  );

  // const width = 900;
  // const height = 500 - verticalMargin;
  // const margin = defaultMargin;
  // const events = false;

  // const xMax = width - margin.left - margin.right;
  // const yMax = height - margin.top - margin.bottom;
  // const root = hierarchy(stratifiedData).sort(
  // 	(a, b) => (b.value || 0) - (a.value || 0)
  // );
  // const tileMethod = "treemapSquarify";

  // return width < 10 ? null : (
  // 	<div className="p-10">
  // 		https://airbnb.io/visx/treemap
  // 		<svg width={width} height={height}>
  // 			<rect width={width} height={height} rx={14} fill={background} />
  // 			<Treemap<typeof stratifiedData>
  // 				top={margin.top}
  // 				root={root}
  // 				size={[xMax, yMax]}
  // 				tile={tileMethods[tileMethod]}
  // 				round
  // 			>
  // 				{(treemap) => (
  // 					<Group>
  // 						{treemap
  // 							.descendants()
  // 							.reverse()
  // 							.map((node, i) => {
  // 								const nodeWidth = node.x1 - node.x0;
  // 								const nodeHeight = node.y1 - node.y0;
  // 								return (
  // 									<Group
  // 										key={`node-${i}`}
  // 										top={node.y0 + margin.top}
  // 										left={node.x0 + margin.left}
  // 									>
  // 										{node.depth === 1 && (
  // 											<rect
  // 												width={nodeWidth}
  // 												height={nodeHeight}
  // 												stroke={background}
  // 												strokeWidth={4}
  // 												fill="transparent"
  // 											/>
  // 										)}
  // 										{node.depth > 2 && (
  // 											<rect
  // 												width={nodeWidth}
  // 												height={nodeHeight}
  // 												stroke={background}
  // 												fill={colorScale(
  // 													node.value || 0
  // 												)}
  // 											/>
  // 										)}
  // 									</Group>
  // 								);
  // 							})}
  // 					</Group>
  // 				)}
  // 			</Treemap>
  // 		</svg>
  // 	</div>
  // );
}
