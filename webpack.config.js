const path = require('path')
const webpack = require('webpack')
const ConcatPlugin = require('webpack-concat-plugin')

const PATHS = {
  app: path.join(__dirname, 'src/ApplicationBundle/Resources/assets/js/'),
  build: path.join(__dirname, 'public_html')
}


module.exports = {
  entry: {
    app: PATHS.app
  },
  output: {
    path: PATHS.build,
    filename: '[name].webpack.js'
  },
  plugins: [
    new webpack.ProvidePlugin({
  $: 'jquery',
  jQuery: 'jquery',
}),
new ConcatPlugin({
  uglify: true, // or you can set uglifyjs options
  useHash: false, // md5 file
  sourceMap: false, // generate sourceMap
  name: 'flexible', // used in html-webpack-plugin
  fileName: 'app.min.js', // would output to 'flexible.d41d8cd98f00b204e980.bundle.js'
  filesToConcat: [
    'bower_components/AdminLTE/plugins/jQuery/jquery-2.2.3.min.js', //TODO
    'bower_components/AdminLTE/plugins/jQueryUI/jquery-ui.min.js', //TODO
    'src/ApplicationBundle/Resources/assests/js/plugins/popper.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.js',
    'bower_components/moment/min/moment-with-locales.js',
    'bower_components/AdminLTE/bootstrap/js/bootstrap.js',
    'bower_components/sweetalert/dist/sweetalert.min.js',
    'bower_components/bootstrap-daterangepicker/daterangepicker.js',
    'node_modules/owl.carousel/dist/owl.carousel.js',
    'src/ApplicationBundle/Resources/assests/js/utilities.js',
    'src/ApplicationBundle/Resources/assests/js/loader.js',
    'src/ApplicationBundle/Resources/assests/js/formValidate.js',
    'src/ApplicationBundle/Resources/assests/js/event_marker.js',
    'src/ApplicationBundle/Resources/assests/js/legacy/translator.js',
    'src/ApplicationBundle/Resources/assests/js/legacy/bonuses.js',
    'src/ApplicationBundle/Resources/assests/js/legacy/print.js',
    'src/ApplicationBundle/Resources/assests/js/legacy/details.js',
    'src/ApplicationBundle/Resources/assests/js/legacy/fileUpload.js',
    'src/ApplicationBundle/Resources/assests/js/legacy/dateDiff.js',
    'src/ApplicationBundle/Resources/assests/js/legacy/casino.js',
    'src/ApplicationBundle/Resources/assests/js/legacy/loyalty.js',
    'src/ApplicationBundle/Resources/assests/js/legacy/system-messages.js',
    'src/ApplicationBundle/Resources/assests/js/legacy/locator.js',
    'src/ApplicationBundle/Resources/assests/js/router.js',
    'src/ApplicationBundle/Resources/assests/js/registration.js',
    'src/ApplicationBundle/Resources/assests/js/formValidator.js', //TODO: check
    'src/ApplicationBundle/Resources/assests/js/preliveLanding.js',
    'src/ApplicationBundle/Resources/assests/js/prelive.js',
    'src/ApplicationBundle/Resources/assests/js/betslip.js',
    'src/ApplicationBundle/Resources/assests/js/deposit.js',
    'src/ApplicationBundle/Resources/assests/js/application.js'


  ]
})
]
}
