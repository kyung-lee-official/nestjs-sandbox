const Item = (props: any) => {
  const { children } = props;
  return (
    <div
      className="flex flex-col gap-4
			bg-neutral-300"
    >
      {children}
    </div>
  );
};

export const GridPattern2 = () => {
  return (
    <div
      className="lg:flex
			grid [grid-template-columns:repeat(auto-fill,minmax(140px,1fr))]
			w-full gap-10"
    >
      <Item>Lorem ipsum </Item>
      <Item>
        <div>Lorem ipsum dolor sit amet consectetur</div>
        <div>Lorem ipsum dolor sit amet</div>
        <div>Lorem ipsum dolor sit amet</div>
      </Item>
      <Item>Lorem ipsum dolor sit</Item>
      <Item>Lorem ipsum dolor</Item>
      <Item>Lorem</Item>
    </div>
  );
};
