import { NextApiHandler } from "next";
import TextToSVG from "text-to-svg";
import { promisify } from "util";
import { readFileSync } from "fs";
import path from "path";

const load = promisify(TextToSVG.load);

const handler: NextApiHandler = async (req, res) => {
  const basePath = path.join(process.cwd(), "public")
  const fontFilePath = path.join(basePath, "poppins-v20-latin-ext_latin_devanagari-regular.woff");
  const textToSvg = await load(fontFilePath);

  if (!textToSvg) {
    return {
      notFound: true
    }
  }

  const text = req.query.slug;

  const fontSize = 130;
  const options: TextToSVG.GenerationOptions = {
    x: 0,
    y: fontSize * (182 / 130),
    fontSize: fontSize,
    anchor: 'left bottom',
    attributes: {
      stroke: "black",
    },
  };

  const svgContent = textToSvg.getSVG(String(text), options);

  const testauskoiraLogo = readFileSync(path.join(basePath, "logo.svg"), "utf8").replace(/height=\"[0-9]*\"/, `height="${textToSvg.getHeight(fontSize)}"`);
  const result = `<svg>${testauskoiraLogo}${svgContent}</svg>`

  res
    .setHeader("Content-Type", "image/svg+xml")
    .status(200)
    .send(result)
}

export default handler;