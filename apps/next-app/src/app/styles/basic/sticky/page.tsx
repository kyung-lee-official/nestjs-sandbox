const Page = () => {
  return (
    <div
      className="flex flex-col justify-center items-center w-[1200px] m-auto p-8 gap-4
            bg-blue-200"
    >
      <h1 className="text-2xl">Example 1</h1>
      <q
        className="w-7/12 p-4
				text-gray-500
				bg-gray-500/20
				border-l-4 border-gray-600"
      >
        <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/position#sticky">
          This value always creates a new stacking context. Note that a sticky
          element &quot;sticks&quot; to its nearest ancestor that has a
          &quot;scrolling mechanism&quot; (created when `overflow` is `hidden`,
          `scroll`, `auto`, or `overlay`), even if that ancestor isn&apos;t the
          nearest actually scrolling ancestor.
        </a>
      </q>
      <div className="w-7/12 p-4 text-gray-500">
        In this case, the nearest scrolling ancestor of the{" "}
        <span className="text-xl text-sky-100 bg-sky-500/80">
          sticky element
        </span>{" "}
        is coincidently its direct parent, the{" "}
        <span className="text-xl text-green-500 bg-green-200">
          green container
        </span>{" "}
        .
      </div>
      <div
        className="w-7/12 h-[550px] p-12
				bg-green-200 
				overflow-y-auto"
      >
        <div className="p-4 bg-rose-300/70">
          In this demo you can control the position property for the yellow box.{" "}
          <br />
          To see the effect of sticky positioning, select the position: sticky
          option and scroll this container. The element will scroll along with
          its container, until it is at the top of the container (or reaches the
          offset specified in top), and will then stop scrolling, so it stays
          visible.
        </div>
        <div
          className="sticky top-10
					flex flex-col justify-center items-center w-10/12 p-4
					text-sky-100
					bg-sky-500/80"
        >
          <h1 className="text-xl">sticky top-10</h1>
          <div>
            Note that here top-10 (40px) is relative to the content area of the
            sticky element&lsquo;s container, the padding of the container is
            not counted.
          </div>
        </div>
        <div className="p-4 bg-rose-300/70">
          Line 1. <br />
          <br />
          The rest of this text is only supplied to make sure the container
          overflows, so as to enable you to scroll it and see the effect. Far
          out in the uncharted backwaters of the unfashionable end of the
          western spiral arm of the Galaxy lies a small unregarded yellow sun.
          Orbiting this at a distance of roughly ninety-two million miles is an
          utterly insignificant little blue green planet whose ape-descended
          life forms are so amazingly primitive that they still think digital
          watches are a pretty neat idea.
          <br />
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iste est
          aperiam magnam saepe tempore, soluta nulla asperiores eum quam
          doloribus provident voluptatum repellendus? Natus, similique
          temporibus! Architecto magni delectus facere? Lorem ipsum dolor sit,
          amet consectetur adipisicing elit. Iste est aperiam magnam saepe
          tempore, soluta nulla asperiores eum quam doloribus provident
          voluptatum repellendus? Natus, similique temporibus! Architecto magni
          delectus facere? Lorem ipsum dolor sit, amet consectetur adipisicing
          elit.
        </div>
        <div
          className="sticky bottom-10
					flex flex-col justify-center items-center w-10/12 p-4
					text-sky-100
					bg-red-500/90"
        >
          <h1 className="text-xl">sticky bottom-10</h1>
        </div>
        <div className="p-4 bg-rose-300/70">
          Iste est aperiam magnam saepe tempore, soluta nulla asperiores eum
          quam doloribus provident voluptatum repellendus? Natus, similique
          temporibus! Architecto magni delectus facere? Lorem ipsum dolor sit,
          amet consectetur adipisicing elit. Iste est aperiam magnam saepe
          tempore, soluta nulla asperiores eum quam doloribus provident
          voluptatum repellendus? Natus, similique temporibus! Architecto magni
          delectus facere? Lorem ipsum dolor sit, amet consectetur adipisicing
          elit. Iste est aperiam magnam saepe tempore, soluta nulla asperiores
          eum quam doloribus provident voluptatum repellendus?
        </div>
      </div>
      <hr className="w-7/12 my-6 border-sky-400 border-2" />
      <h1 className="text-2xl">Example 2</h1>
      <q
        className="w-7/12 p-4
				text-gray-500
				bg-gray-500/20
				border-l-4 border-gray-600"
      >
        <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/position#types_of_positioning">
          <b>A stickily positioned element</b> is an element whose computed
          `position` value is sticky. It&apos;s treated as relatively positioned
          until its containing block crosses a specified threshold (such as
          setting `top` to value other than auto) within its flow root (or the
          container it scrolls within), at which point it is treated as{" "}
          <b>
            &quot;stuck&quot; until meeting the opposite edge of its containing
            block
          </b>
          .
        </a>
      </q>
      <div className="w-7/12 p-4 text-gray-500">
        In this case, the{" "}
        <span className="text-xl text-sky-100 bg-sky-500/80">
          sticky element
        </span>
        &lsquo;s nearest scrolling ancestor is NOT the{" "}
        <span className="text-xl text-purple-100 bg-purple-600">
          direct parent
        </span>
        , instead, the{" "}
        <span className="text-xl text-green-500 bg-green-200">
          green container
        </span>{" "}
        is. By setting <b>top-10</b>, the sticky element will scroll along with
        its direct parent, until it is at the top of the sticky element reaches
        the offset relative to the{" "}
        <span className="text-xl text-green-500 bg-green-200">
          green container
        </span>
        , and will then stop scrolling, so it stays visible
        <br />, until it reaches the bottom of the{" "}
        <span className="text-xl text-purple-100 bg-purple-600">
          direct parent
        </span>
        , and will then continue to scroll along with its{" "}
        <span className="text-xl text-purple-100 bg-purple-600">
          direct parent
        </span>
        .
      </div>
      <div
        className="w-7/12 h-[550px] p-12
				bg-green-200 
				overflow-y-auto"
      >
        <div className="p-4 bg-rose-300/70">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iste est
          aperiam magnam saepe tempore, soluta nulla asperiores eum quam
          doloribus provident voluptatum repellendus? Natus, similique
          temporibus! Architecto magni delectus facere?
        </div>
        <div
          className="flex h-72
					bg-purple-600"
        >
          <div
            className="sticky top-10
						flex flex-col justify-center items-center w-10/12 h-20 p-4
						text-sky-100
						bg-sky-500/80"
          >
            <h1 className="text-xl">sticky top-10</h1>
          </div>
        </div>
        <div className="p-4 bg-rose-300/70">
          Line 1. <br />
          <br />
          The rest of this text is only supplied to make sure the container
          overflows, so as to enable you to scroll it and see the effect. Far
          out in the uncharted backwaters of the unfashionable end of the
          western spiral arm of the Galaxy lies a small unregarded yellow sun.
          Orbiting this at a distance of roughly ninety-two million miles is an
          utterly insignificant little blue green planet whose ape-descended
          life forms are so amazingly primitive that they still think digital
          watches are a pretty neat idea.
          <br />
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iste est
          aperiam magnam saepe tempore, soluta nulla asperiores eum quam
          doloribus provident voluptatum repellendus? Natus, similique
          temporibus! Architecto magni delectus facere? Lorem ipsum dolor sit,
          amet consectetur adipisicing elit. Iste est aperiam magnam saepe
          tempore, soluta nulla asperiores eum quam doloribus provident
          voluptatum repellendus? Natus, similique temporibus! Architecto magni
          delectus facere? Lorem ipsum dolor sit, amet consectetur adipisicing
          elit.
          <br />
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iste est
          aperiam magnam saepe tempore, soluta nulla asperiores eum quam
          doloribus provident voluptatum repellendus? Natus, similique
          temporibus! Architecto magni delectus facere? Lorem ipsum dolor sit,
          amet consectetur adipisicing elit. Iste est aperiam magnam saepe
          tempore, soluta nulla asperiores eum quam doloribus provident
          voluptatum repellendus? Natus, similique temporibus! Architecto magni
          delectus facere? Lorem ipsum dolor sit, amet consectetur adipisicing
          elit.
        </div>
      </div>
    </div>
  );
};

export default Page;
