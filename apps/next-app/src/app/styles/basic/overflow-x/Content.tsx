"use client";

const Content = () => {
  return (
    <div className="flex justify-center w-full">
      <div
        className="flex-[0_0_300px]
				bg-sky-200"
      >
        StyledSidebar
      </div>
      <div
        className="flex-[0_1_auto] min-w-0 p-8
				bg-cyan-400"
      >
        <div>
          A flex item cannot be smaller than the size of its content along the
          main axis.
        </div>
        <div className="text-gray-500">
          Flex items refers to children of a flex container, note that items
          themselves may not have to be flex containers.
        </div>
        <div>
          The defaults min-width (in row-direction) and min-height (in
          column-direction) is auto, you can override them to min-width: 0 and
          min-height: 0 to allow the content to overflow the container.
        </div>
        <div
          className="bg-pink-200
					overflow-x-auto"
        >
          <div
            className="w-[700px] p-1 m-1
						bg-green-200"
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum
            exercitationem animi optio harum cupiditate dolor impedit eos
            nesciunt esse magnam deserunt ut quia iste quaerat sunt, quis non,
            delectus molestiae.
          </div>
        </div>
        <div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima harum
          explicabo dolore delectus dolor? Excepturi dolor fugiat repellat ipsa
          consectetur, maiores expedita, veniam culpa sit, beatae repellendus
          vitae dolores perferendis? Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Nemo asperiores ratione dicta illum incidunt
          explicabo sunt sequi sed blanditiis. Molestiae adipisci ratione
          accusantium laudantium obcaecati alias vel optio repellendus libero.
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reiciendis
          accusantium fugiat porro ea quia, consectetur quae, ratione doloribus
          eligendi libero ducimus expedita dolor! Non perferendis deserunt ex
          repellendus, maiores aut?
        </div>
      </div>
    </div>
  );
};

export default Content;
