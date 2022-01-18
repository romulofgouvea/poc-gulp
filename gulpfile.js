var gulp = require("gulp");
const zip = require("gulp-zip");
var del = require("del");

const cp = require("child_process");

const PATH_OUTPUT_DEFAULT = "C:/dist";
const OUTPUT_NAME_FOLDER = "tempBuildRelease";
let PATH_WEB_FOLDER = "";
let NAME_PROJECT = "";

const ARCHIVES_NAME_REMOVE = [
  "appsettings.Development.json",
  "appsettings.json",
  "web.config",
];

// fetch command line arguments
const arg = ((argList) => {
  let arg = {},
    a,
    opt,
    thisOpt,
    curOpt;
  for (a = 0; a < argList.length; a++) {
    thisOpt = argList[a].trim();
    opt = thisOpt.replace(/^\-+/, "");

    if (opt === thisOpt) {
      // argument value
      if (curOpt) arg[curOpt] = opt;
      curOpt = null;
    } else {
      // argument name
      curOpt = opt;
      arg[curOpt] = true;
    }
  }

  return arg;
})(process.argv);

const clean = () => {
  return del([`${PATH_OUTPUT_DEFAULT}`], {
    force: true,
  });
};

const build = () => {
  return cp.exec(
    `cd ${PATH_WEB_FOLDER} && dotnet publish -c release -o ${PATH_OUTPUT_DEFAULT}/${OUTPUT_NAME_FOLDER}`,
    (err, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      if (err) {
        console.log(err);
      }
    }
  );
};

const cleanUnecessaryFiles = () => {
  var paths = ARCHIVES_NAME_REMOVE.map(
    (item) => `${PATH_OUTPUT_DEFAULT}/${OUTPUT_NAME_FOLDER}/${item}`
  );
  return del(paths, { force: true });
};

const zipFolder = async () => {
  var date = new Date();
  var dateString =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  var nameOutputZip = `${NAME_PROJECT}_${dateString}_${date.getTime()}.zip`;

  await gulp
    .src(`${PATH_OUTPUT_DEFAULT}/${OUTPUT_NAME_FOLDER}/**`)
    .pipe(zip(nameOutputZip))
    .pipe(gulp.dest(`${PATH_OUTPUT_DEFAULT}`))
    .pipe(cp.exec(`start ${PATH_OUTPUT_DEFAULT}`));
};

// exports.clean = clean;
// exports.build = build;
// exports.cleanFiles = cleanUnecessaryFiles;
exports.homolog = gulp.series(clean, build, cleanUnecessaryFiles, zipFolder);

exports.release = (done) => {
  if (arg.p || arg.project) {
    var project = arg.p || arg.project;
    switch (project) {
      case "sgc":
        PATH_WEB_FOLDER = "C:/workspace/mrn-sgc/MRN-Contratos/srv/Web";
        NAME_PROJECT = "SGC";
        break;
    }
  } else {
    console.log("Serviço nao foi espeificado");
    return;
  }

  if (arg.e == "homolog" || arg.enviroment == "homolog") {
    console.log("Gerando Release Homologação");
    exports.homolog();
    done();
  } else {
    console.log("O ambiente nao foi espeificado.");
    return;
  }
};
