var gulp = require("gulp");
var awspublish = require("gulp-awspublish");
var rename = require("gulp-rename");
var pkg = require("./package.json");

gulp.task("publish", function () {
  // Make sure we know which branch we're publishing to
  if (!process.env.GIT_BRANCH) {
    throw new Error(
      "Gulp publish needs a branch name: GIT_BRANCH=master gulp publish"
    );
  }
  // The env var usually has the form "remote/branch", so grab just the branch
  var branchName = process.env.GIT_BRANCH.split("/").pop();
  var environment = process.env.DEPLOY_ENV || "";
  var targetDir =
    pkg.name +
    "/" +
    (environment ? environment + "/" : "") +
    (branchName === "master" ? "" : branchName + "/") +
    pkg.version;
  console.log(
    "Pushing to https://plugins.coviu.com/" + targetDir + "/plugin.js"
  );

  // create a new publisher
  var publisher = awspublish.create({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    params: {
      Bucket: "coviu-plugins",
    },
    region: "ap-southeast-2",
  });

  // define custom headers
  var headers = {
    "Cache-Control": "max-age=0, no-transform, public",
  };

  // Grab our set of standalone files
  return (
    gulp
      .src(["dist/*"])

      // Put all the files under a subdirectory
      .pipe(
        rename(function (path) {
          path.dirname = targetDir;
        })
      )

      // Compress files
      .pipe(awspublish.gzip())

      // publisher will add Content-Length, Content-Type and headers specified above
      // If not specified it will set x-amz-acl to public-read by default
      .pipe(publisher.publish(headers))

      // create a cache file to speed up consecutive uploads
      .pipe(publisher.cache())

      // print upload updates to console
      .pipe(awspublish.reporter())
  );
});