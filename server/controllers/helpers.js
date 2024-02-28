const maxSize = 2 * 1024 * 1024; // for 5MB
const imageFilter = (req, file, cb) => {
  // accepts image only
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
  }
};

exports.imageFilter = imageFilter;
