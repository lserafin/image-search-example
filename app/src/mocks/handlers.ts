import { rest } from "msw";

const BASE_URL = import.meta.env.VITE_API_URL;

export const handlers = [
  rest.get(`${BASE_URL}/api/getImages`, (_, res, ctx) => {
    const data = [
      {
        src: "data/Abra-06b9eec4827d4d49b1b4c284308708df_jpg.rf.e2d4cd14d8057f4a6474cd50e64535fe.jpg",
        alt: "data/abra-1",
      },
      {
        src: "data/Abra-10a9f06ec6524c66b779ea80354f8519_jpg.rf.e2ec90c8492bbc41ce46ad4b3077b86a.jpg",
        alt: "data/abra-2",
      },
      {
        src: "data/Abra-2eb2a528f9a247358452b3c740df69a0_jpg.rf.bdbfe2c31e8816602a2c897add07bc1d.jpg",
        alt: "data/abra-3",
      },
    ];
    return res(ctx.status(200), ctx.json(data));
  }),
  rest.get(`${BASE_URL}/api/search`, (req, res, ctx) => {
    const imagePaths = req.url.searchParams.getAll("imagePath");
    const data = [
      {
        src: "data/Abra-2eb2a528f9a247358452b3c740df69a0_jpg.rf.bdbfe2c31e8816602a2c897add07bc1d.jpg",
        score: 1.00000012,
      },
      {
        src: "data/Abra-3c4ab4f4e1d548e5bc038715b47b4d51_jpg.rf.21401fbd02af38e2f245b622c57f05b2.jpg",
        score: 0.925502,
      },
      {
        src: "data/Abra-7a300d6f799c48d1943cafaa5ab24e27_jpg.rf.cc822016dfca3b7bb372610cfd5bcb07.jpg",
        score: 0.862540066,
      },
      {
        src: "data/Abra-4e554e4a0f624656a7b1542b679b6157_jpg.rf.c2998384c90028502e05c110025795a1.jpg",
        score: 0.858543575,
      },
      {
        src: "data/Abra-5c0ca320656b4f2fadea7aefeb80da53_jpg.rf.fb8ace5c83fd9cf8e80e2d570b4475c3.jpg",
        score: 0.827425539,
      },
      {
        src: "data/Abra-06b9eec4827d4d49b1b4c284308708df_jpg.rf.e2d4cd14d8057f4a6474cd50e64535fe.jpg",
        score: 0.817970872,
      },
    ];
    const matchingImage = data.find((item) => item.src.includes(imagePaths[0]));

    const similarImages = data.filter((item) => item !== matchingImage);
    const combinedData = [matchingImage, ...similarImages];
    return res(ctx.status(200), ctx.json(combinedData));
  }),
];
