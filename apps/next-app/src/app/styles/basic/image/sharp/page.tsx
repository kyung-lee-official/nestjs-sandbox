import Content from "./Content";
import { SharpImage } from "./Sharp";
import { sharpImageUrl } from "./Sharp/actions";

const Page = async () => {
  const url =
    "https://fastly.picsum.photos/id/295/200/200.jpg?hmac=nsWHMt5f11TALPFeS_0t6tIlO2CkViBNAbAbSlhu8P4";

  return (
    <div style={{ padding: "20px" }}>
      <h1>Sharp Image Processing Demo</h1>

      {/* Server-side processing */}
      <section style={{ marginBottom: "40px" }}>
        <h2>Server-Side Sharp Processing</h2>
        <div style={{ display: "flex", gap: "20px", alignItems: "start" }}>
          <div>
            <p>Original Image (Server-side)</p>
            <img
              src={url}
              alt="original server"
              style={{ border: "1px solid #ccc" }}
            />
          </div>

          <div>
            <p>Legacy Method (Direct Server Action)</p>
            <img
              src={await sharpImageUrl(url)}
              alt="legacy sharp"
              style={{ border: "1px solid #ccc" }}
            />
          </div>
        </div>
      </section>

      <div>
        <p>Sharp Processed (Server-side)</p>
        <SharpImage
          src={url}
          alt="server processed"
          resize={{ width: 250, height: 250 }}
          tint={{ r: 255, g: 220, b: 180 }}
          format="jpeg"
          quality={90}
        />
      </div>

      {/* Client-side processing */}
      <section>
        <Content url={url} />
      </section>
    </div>
  );
};

export default Page;
