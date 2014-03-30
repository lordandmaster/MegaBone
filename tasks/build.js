/**
 * @package Megabone
 *
 * Compiles the project and outputs the AMD and non-AMD versions to the
 * path specified in renderTarget()
 *
 * Update src_files with the list of source files, in the order of output
 */

var src_files = [
	'Util.js',
	'Router.js',
	'View.js',
	'CollectionView.js'
];

var export_var = 'MegaBone';

var fs = require('fs');
var path = require('path');

var src_dir = path.resolve(__dirname, '../src');

//------------------------------------------------------------------------

function getFileContents (filepath, callback)
{
	fs.readFile(filepath, 'utf8', function (err, contents) {
		if ( err ) {
			console.log(err);
			return;
		}
		
		if ( callback ) {
			callback(contents);
		}
	});
}

function renderTemplate (tpl, data, callback)
{
	var tpl_path = path.resolve(__dirname, tpl);
	getFileContents(tpl_path, function (contents) {
		for ( key in data ) {
			regex = new RegExp('<<' + key + '>>', 'g');
			contents = contents.replace(regex, data[key]);
		}
		
		if ( callback ) {
			callback(contents);
		}
	});
}

function getConcatenatedSrc (callback)
{
	var body = '';
	
	var getSrcContents = function (ii) {
		var src_path = path.resolve(src_dir, src_files[ii]);
		getFileContents(src_path, function (contents) {
			body += contents + "\n;\n";
			if ( ii + 1 < src_files.length ) {
				getSrcContents(ii + 1);
			} else if ( callback ) {
				callback(body);
			}
		});
	};
	
	getSrcContents(0);
}

function renderTarget (tpl_file, data, ext)
{
	renderTemplate(tpl_file, data, function (output) {
		var filename = path.resolve(__dirname, '../' + export_var + ext);
		fs.writeFile(filename, output);
	});
}

//------------------------------------------------------------------------
// Execution

getConcatenatedSrc(function (body) {
	var data = { body: body, export_var: export_var };
	renderTarget('output.tpl', data, '.js');
	renderTarget('output.amd.tpl', data, '.amd.js');
});
