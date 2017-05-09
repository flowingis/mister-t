const gulp = require('gulp');
const exec = require('child_process').exec;
const gutil = require('gulp-util');

gulp.task('deploy', () => {
  gutil.log('Transfering file to server...');
  const rsync = exec('rsync -rlDcz --exclude-from=./rsync_exclude --delete --force --progress ./  centos@52.29.194.12:/var/www/mister-t/');

  rsync.stdout.on('data', function(data) {
    gutil.log(data);
  });
  rsync.stderr.on('data', function(data) {
    gutil.log(gutil.colors.red(data));
  });
  rsync.on('close', function(code) {
    gutil.log('File transfer complete');
  });
});

