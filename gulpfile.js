var gulp = require("gulp"),
    gls  = require("gulp-live-server");

gulp.task("serve", function () {
    var server = gls.new("server.js");
    server.start();

    gulp.watch(["./src/views/**/*.jade", "./src/static/**/*"], server.notify);

    gulp.watch(["./server.js", "./src/routes/**/*.js", "./src/models/**/*.js"],
               function () {
                   server.start();
               });
});
