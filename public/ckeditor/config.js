/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function (config) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
	config.heightt = '600px';
	config.removePlugins = 'easyimage, cloudservices';

	config.image_prefillDimensions = false; //style width 삭제
};

CKEDITOR.config.allowedContent = true;