const fs = require("fs");
const path = require("path");

module.exports = async (slicePath, res) => {
  try {
    const filePath = path.resolve(...slicePath);

    if (await fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);

          return res.status(500).json({ ok: false, message: "Произошла ошибка при удалении фото", });
        }
      });
    }
  } catch (err) {
    console.log(err);

    return res.status(500).json({ message: "Произошла ошибка при удалении файлов", ok: false, });
  }
};