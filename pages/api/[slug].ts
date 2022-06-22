import { NextApiHandler } from "next";
import TextToSVG from "text-to-svg";
import { promisify } from "util";
import path from "path";
const svgBuilder = require("svg-builder");

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

  const fontSize = 102;
  const xOffset = 120
  const options: TextToSVG.GenerationOptions = {
    x: xOffset,
    y: fontSize * (182 / 130),
    fontSize: fontSize,
    anchor: 'left bottom',
    attributes: {
      stroke: "black",
      fill: "black"
    },
  };

  const svgContent = textToSvg.getD(String(text), options);
  const metrics = textToSvg.getMetrics(String(text), options);

  const resultSvg = svgBuilder
    .width(metrics.width + 102 + xOffset)
    .height(metrics.height)
    .path({
      d: svgContent,
    })
    .path({
      d: "M67.9.503c-5.293.1-10.412 1.956-14.939 4.612-5.339 3.13-10.184 7.2-14.957 11.106-1.193.974-2.366 1.975-3.553 2.956-.313.267-.627.521-.94.781-.427.347-.66.78-.567 1.282.12.607.467 1.108 1.167 1.188.667.08 1.333.14 2 .206.013.007.026.007.047.007 1.606.16 3.199.187 4.799-.093.166-.027.326-.04.473-.033.886.026 1.32.653.953 1.648-.213.573-.373 1.174-.613 1.735-1.087 2.51-2.133 5.039-3.3 7.515-1.686 3.591-3.333 7.095-5.912 10.132-.02.02-.04.046-.073.08-.047.053-.094.113-.147.167-7.886 9.143-19.058 14.896-26.356 24.567-3.033 4.025-5.9 8.45-5.98 13.642-.02 1.482.074 2.983.327 4.438a27.065 27.065 0 0 0 3.02 8.583 41.374 41.374 0 0 0 5.506 7.709c.613.68 1.152 1.415 1.453 2.296.333.961.526 1.902-.22 2.796-.287.34-.493.747-.72 1.135-.5.874-.394 1.942.36 2.609.726.634 1.486 1.255 2.313 1.749 7.659 4.572 16.71 7.622 25.296 9.911 1.693.454 3.226-.854 3.18-2.663-.067-2.563-2.167-4.345-4.267-5.466-2.426-1.289-5.119-1.896-7.732-2.683-.713-.214-1.446-.34-2.173-.507 0-.013-.007-.021-.007-.034-.013-.046-.02-.1-.033-.146.274-.174.553-.341.827-.514 4.686-3.038 9.645-5.82 14.084-9.211.294-.22.487-.28.827-.2 2.713.654 5.426 1.301 8.146 1.942l.047.007.92.153c.546 1.796 1.094 3.591 1.643 5.386.414 1.357.847 2.714 1.275 4.062.812 2.556 1.337 5.236 3.017 7.408.444.574.98 1.111 1.661 1.358.932.337 1.924.076 2.868-.054.947-.131 1.903-.188 2.853-.32 1.307-.18 2.3-.881 2.94-2.055.607-1.101.593-2.276.46-3.478-.127-1.187-.7-2.155-1.54-2.963-1.073-1.041-2.373-1.722-3.806-2.129-.287-.087-.387-.207-.394-.494-.006-.794-.046-1.588-.066-2.382 0-3.831-.133-7.689-.333-11.513-.42-8.076.52-10.071.66-10.145.046 4.558.413 8.723.633 10.592.42 3.611 1.086 7.261 1.86 10.758.32 1.455.706 2.91 1.766 4.045.533.581 1.08 1.135 2 1.068 1.18-.087 2.36-.074 3.539-.127.353-.013.72-.066 1.06-.167 2.513-.701 2.953-4.051 1.86-5.846-.887-1.455-2.28-2.242-3.893-2.857.047-.527.1-1.041.133-1.561.34-6.154.566-12.214 1.773-18.281 1.173-5.926 2.933-11.793 4.886-17.446 1.393-4.038 3.133-8.65 2.286-12.968-.54-2.743-2.14-5.433-3.486-7.849-1.446-2.616-3.152-5.366-3.026-8.476.067-1.775.753-3.47 1.567-5.059.74-1.455 1.579-3.164 2.692-4.378a4.866 4.866 0 0 1 1.06-.848c.787-.48 1.694-.814 2.52-1.141 3.013-1.188 5.673-3.11 8.305-4.992 2.307-1.642 4.647-3.29 6.573-5.366 2.026-2.182 3.52-4.88 3.833-7.882.133-1.342-.021-2.563-.774-3.685-.88-1.321-2.5-.96-3.865-.86-1.834.126-3.66.306-5.48.547-2.12.267-4.419.901-6.558.46C78.34 3.18 73.742.5 68.219.5l-.32.003ZM46.07 95.115l-1.52-.04 1.64-1.521c.24-.227.479-.447.726-.667.406-.38.72-.414.96-.094 0 .006.006.013.006.02.067.087.12.2.174.334.166.454.34.9.513 1.388.02.06.046.12.067.18.172.46.266.721.266.721-1.026-.107-1.94-.174-2.833-.32Z",
      fill: "#0D0D0D",
    })
    .path({
      d: "M8.592 109.131c.116.115.168.178.168.178l-.094-.42a.776.776 0 0 0-.074.242ZM66.56 52.12c5.945 10.56-4.166 34.466-4.166 34.466.046 4.558.413 8.723.633 10.592.42 3.611 1.086 7.261 1.86 10.758.32 1.455.706 2.91 1.766 4.045.533.581 1.08 1.135 2 1.068 1.18-.087 2.36-.074 3.539-.127.353-.014.72-.067 1.06-.167 2.513-.701 2.953-4.051 1.86-5.846-.887-1.455-2.28-2.243-3.893-2.857.047-.527.1-1.041.133-1.561.34-6.154.566-12.214 1.773-18.281 1.173-5.926 2.933-11.793 4.886-17.446 1.393-4.038 3.133-8.65 2.286-12.968-.54-2.743-2.14-5.433-3.486-7.85-1.446-2.615-3.153-5.365-3.026-8.475.067-1.775.753-3.47 1.567-5.06.74-1.454 1.579-3.163 2.692-4.377a4.87 4.87 0 0 1 1.06-.848 1.4 1.4 0 0 0-.509-.084c-4.168.001-18.915 12.806-12.036 25.019ZM27.252 83.696c1.053 5.253 8.005 11.813 5.246 18.381-2.233 5.339-6.633 9.804-6.633 9.824l-.04.02.513-.047c-.013-.046-.02-.1-.033-.147.274-.173.553-.34.827-.514 4.686-3.037 9.645-5.819 14.084-9.21.294-.22.487-.28.827-.2 2.713.654 5.426 1.301 8.145 1.942l.047.007.92.153-2.253-8.469c-1.026-.107-1.94-.174-2.833-.32l-1.52-.04 1.64-1.522c.24-.227.48-.447.727-.667.406-.38.72-.414.96-.094-1.96-4.799-6.433-14.59-10.866-16.165-1.111-.396-2.188-.578-3.195-.578-4.34 0-7.412 3.384-6.563 7.646ZM33.51 19.958c-.422.352-.659.78-.566 1.282.12.607.467 1.108 1.167 1.188.667.08 1.333.14 2 .206.013.007.026.007.047.007 1.606.16 3.2.187 4.799-.093.166-.027.326-.04.473-.033.886.026 1.32.653.953 1.648-.213.573-.374 1.174-.613 1.735-1.087 2.51-2.134 5.039-3.3 7.515-1.686 3.591-3.333 7.095-5.912 10.132-.02.02-.04.046-.06.066l-.014.014c-.046.053-.093.113-.146.167l.006.02c5.82-6.054 21.204-22.172 17.744-25.83-.772-.817-2.316-1.136-4.169-1.136-4.558 0-10.988 1.93-12.408 3.112Z",
      fill: "#0D0D0D",
    })
    .render();

  svgBuilder.reset();

  res
    .setHeader("Content-Type", "image/svg+xml")
    .status(200)
    .send(resultSvg)
}

export default handler;