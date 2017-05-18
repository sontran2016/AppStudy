/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 1/2/17
 * Time: 4:11 PM
 * To change this template use File | Settings | File Templates.
 */
exports.build = function(title, pagetitle, content) {
    return ['<!doctype html>',
        '<html lang="en">\n\n<meta charset="utf-8">\n<title>{title}</title>',
        '<link rel="stylesheet" href="/assets/style.css" />\n',
        '<h1>{pagetitle}</h1>',
        '<div id="content">{content}</div>\n\n']
        .join('\n')
        .replace(/{title}/g, title)
        .replace(/{pagetitle}/g, pagetitle)
        .replace(/{content}/g, content);
};