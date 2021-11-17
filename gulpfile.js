var gulp = require("gulp");
const zip = require("gulp-zip");
var del = require("del");

const cp = require("child_process");

const PATH_OUTPUT_DEFAULT = "C:/dist";
const OUTPUT_NAME_FOLDER = "tempBuildRelease";
const PATH_WEB_FOLDER = "C:/workspace/sgc/001.029.000/MRN-Contratos/srv/Web";

const ARCHIVES_NAME_REMOVE = [
  "appsettings.Development.json",
  "appsettings.json",
  "web.config",
];

const clean = () => {
  return del([`${PATH_OUTPUT_DEFAULT}`], {
    force: true,
  });
};

const build = () => {
  return cp.exec(
    `cd ${PATH_WEB_FOLDER} && dotnet publish -c release -o ${PATH_OUTPUT_DEFAULT}/${OUTPUT_NAME_FOLDER}`
  );
};

const cleanUnecessaryFiles = () => {
  var paths = ARCHIVES_NAME_REMOVE.map(
    (item) => `${PATH_OUTPUT_DEFAULT}/${OUTPUT_NAME_FOLDER}/${item}`
  );
  return del(paths, { force: true });
};

const zipFolder = () => {
  var date = new Date();
  var dateString =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  var nameOutputZip = dateString + "_" + date.getTime() + ".zip";

  gulp
    .src(`${PATH_OUTPUT_DEFAULT}/${OUTPUT_NAME_FOLDER}/**`)
    .pipe(zip(nameOutputZip))
    .pipe(gulp.dest(`${PATH_OUTPUT_DEFAULT}`));

    cp.exec(`start ${PATH_OUTPUT_DEFAULT}`)
};

// exports.clean = clean;
// exports.build = build;
// exports.cleanFiles = cleanUnecessaryFiles;
exports.releaseHomolog = gulp.series(
  clean,
  build,
  cleanUnecessaryFiles,
  zipFolder
);
