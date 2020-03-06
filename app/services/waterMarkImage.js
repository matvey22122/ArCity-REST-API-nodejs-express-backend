import Jimp from 'jimp';
import fs from 'fs';


const waterMarkImage = async (ORIGINAL_IMAGE, LOGO, LOGO_MARGIN_PERCENTAGE) => {
    const [image, logo] = await Promise.all([
        Jimp.read(ORIGINAL_IMAGE),
        Jimp.read(LOGO)
    ]);

    logo.resize(image.bitmap.width / 5, Jimp.AUTO);

    const xMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;
    const yMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;

    const X = image.bitmap.width - logo.bitmap.width - xMargin;
    const Y = image.bitmap.height - logo.bitmap.height - yMargin;

    fs.unlinkSync('public' + ORIGINAL_IMAGE.replace('http://10.10.201.59:3000', ''));

    return image.composite(logo, X, Y, [
        {
            mode: Jimp.BLEND_SCREEN,
        }
    ]);
};

export default waterMarkImage;
//waterMarkImage(ORIGINAL_IMAGE, LOGO, LOGO_MARGIN_PERCENTAGE).then(image => image.write(FILENAME));