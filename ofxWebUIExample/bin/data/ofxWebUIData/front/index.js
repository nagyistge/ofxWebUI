function get(v, defaultValue) {
	return (typeof v === "undefined") ? defaultValue : v;
}

function initUI(io) {
	var Design = {
		UIParts: {
			width: 360,
			height : 25
		}
	}

	io.on('remove', function(data) {
		console.log(data.name + " removed!");
		$("#" + data.name + "_wrapper").remove();
	});

	var notifyChangeValue = function(key, value) {
			io.emit('change', {name: key, value: value});
		},
		createLabel = function(text, isRight) {
			return $('<div class="ofxWebUI_label' + (isRight ? ' right' : '') + '">' + text + '</div>').button({disabled: true}).css({height: 25, fontSize: "80%"})
		}

	function createSlider(param, $main) {
		var min = get(param.option.min, 0),
			max = get(param.option.max, 1),
			initial = get(param.option.initial, 0.5);
		var $ui = $('<div id="' + param.name +'" class="ofxWebUI_item ofxWebUI_slider"></div>'),
			$wrapper = $('<div id="' + param.name + '_wrapper" class="ofxWebUI_wrapper ofxWebUI_slider_wrapper"></div>'),
			$label = createLabel(param.name),
			$value = createLabel(initial, true);

		$wrapper
			.append($label)
			.append($ui)
			.append($value);

		$main.append($wrapper);
		
		var setValue = function(event, ui) {
			$value.button({label: ui.value});
			notifyChangeValue(param.name, ui.value);
		}
		$ui.slider({
			min: min,
			max: max,
			value: initial,
			step: (max - min) / 256.0,
			start: setValue,
			slide: setValue,
			change: setValue,
			stop: setValue
		});
	}

	function createButton(param, $main) {

	}

	function createTextBox(param, $main) {

	}

	function createTextArea(param, $main) {

	}

	function createToggle(param, $main) {
		var initial = param.option.initial,
			checked = initial ? ' checked' : '';

		var $ui = $('<div class="ofxWebUI_item"><input type="checkbox" id="' + param.name + '"' + checked + '><label for="' + param.name + '">' + param.name + '</label></div>'),
			$wrapper = $('<div id="' + param.name + '_wrapper" class="ofxWebUI_wrapper ofxWebUI_toggle_wrapper"></div>'),
			$label = createLabel(param.name),
			$value = createLabel(initial, true);

		$wrapper
			.append($label)
			.append($ui)
			.append($value);
		$main.append($wrapper);

		var setValue = function(event) {
			var checked = $(this).prop('checked') ? 1 : 0;
			notifyChangeValue(param.name, checked)
			$value.button({label: checked});
		};
		$ui.find('input[type=checkbox]')
			.button()
			.change(setValue);
		$ui.find('label').css({width: Design.UIParts.width, height: Design.UIParts.height, fontSize: "80%"})
	}

	function createFlags(param, $main) {
   		var labels = param.option.labels || ["undefined"],
   			initial = param.option.initial || 0,
			htmlFragment = '<div id="' + param.name + '" class="ofxWebUI_item ofxWebUI_select_box">';
		for(var i = 0; i < labels.length; i++) {
			var checked = (i == initial) ? ' checked="checked"' : '';
			htmlFragment	+=	'<input type="radio" id=' + param.name + '_' + i + ' name="' + param.name + '"' + checked + '>'
							+	'<label for="' + param.name + '_' + i + '">' + labels[i] + '</label>';
		}
		htmlFragment += '</div>';
		var $ui      = $(htmlFragment),
			$wrapper = $('<div id="' + param.name + '_wrapper" class="ofxWebUI_wrapper ofxWebUI_select_box_wrapper"></div>"'),
			$label = createLabel(param.name),
			$value = createLabel(initial, true);

		$wrapper
			.append($label)
			.append($ui)
			.append($value);
		$main.append($wrapper);

		$ui.buttonset().find("label").css({width: Design.UIParts.width / labels.length, height: Design.UIParts.height, fontSize: "80%"});

		var setValue = function(event) {
			var selected = this.value;
			$value.button({label: "" + selected});
			
			notifyChangeValue(param.name, selected);
		};
		$ui.find('input[type=radio]').change(setValue);
	}

	function createSelectOption(param, $main) {
   		var labels = param.option.labels || ["undefined"],
   			initial = param.option.initial || 0,
			htmlFragment = '<div id="' + param.name + '" class="ofxWebUI_item ofxWebUI_select_box">';
		for(var i = 0; i < labels.length; i++) {
			var checked = (i == initial) ? ' checked="checked"' : '';
			htmlFragment	+=	'<input type="radio" id=' + param.name + '_' + i + ' name="' + param.name + '"' + checked + '>'
							+	'<label for="' + param.name + '_' + i + '">' + labels[i] + '</label>';
		}
		htmlFragment += '</div>';
		var $ui      = $(htmlFragment),
			$wrapper = $('<div id="' + param.name + '_wrapper" class="ofxWebUI_wrapper ofxWebUI_select_box_wrapper"></div>"'),
			$label = createLabel(param.name),
			$value = createLabel(initial, true);

		$wrapper
			.append($label)
			.append($ui)
			.append($value);
		$main.append($wrapper);

		$ui.buttonset().find("label").css({width: Design.UIParts.width / labels.length, height: Design.UIParts.height, fontSize: "80%"});

		var setValue = function(event) {
			var selected = this.id.substr(this.id.length - 1);
			$value.button({label: "" + selected});

			notifyChangeValue(param.name, selected);
		};
		$ui.find('input[type=radio]').change(setValue);
	}

	function createColor(param, $main) {

	}

	return (function(UI) {
		UI.addParts = {
			slider:   createSlider,
			button:   createButton,
			text:     createTextBox,
			longText: createTextArea,
			toggle:   createToggle,
			flags:    createFlags,
			select:   createSelectOption,
			color:    createColor
		};
		UI.create = function(parameters, $main) {
			for(var i = 0; i < parameters.length; i++) {
				UI.addParts[parameters[i].type](parameters[i], $main);
			}
		};
		return UI;
	})({io: io});
}