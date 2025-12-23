const Page = () => {
  const plaintextAlphabet = "abcdefghijklmnopqrstuvwxyz";
  const ciphertextAlphabet = "nopqrstuvwxyzabcdefghijklm";

  function encrypt(plain: string, cipher: string, text: string) {
    plain = plain + plain.toUpperCase();
    cipher = cipher + cipher.toUpperCase();

    var newText = "";
    for (var i = 0; i < text.length; i++) {
      var c = text.charAt(i);
      var index = plain.indexOf(c);
      if (index >= 0 && index < cipher.length) {
        newText += cipher.charAt(index);
      } else {
        newText += c;
      }
    }
    return newText;
  }

  return (
    <div
      className="flex flex-col justify-center items-center my-10 p-4 gap-4
			bg-slate-200"
    >
      <a className="text-2xl" href="https://www.jfm.com.ar/TuringFonts/">
        TuringFonts
      </a>
      <div
        className="px-2
				font-['arial-rot13']
				border-2 border-dashed border-blue-500"
      >
        {encrypt(
          plaintextAlphabet,
          ciphertextAlphabet,
          "Some sensitive text that only humans are able to read",
        )}
      </div>
      <div>
        <p>
          Note: the font arial-rot13 only support a-z, it won&apos;t be able to
          decode 0-9 or other symbols.
        </p>
        <p>
          To support other symbols, custom your own font:
          <a
            href="https://www.jfm.com.ar/TuringFonts/advanced.html"
            className="underline"
          >
            https://www.jfm.com.ar/TuringFonts/advanced.html
          </a>
        </p>
      </div>
    </div>
  );
};

export default Page;
