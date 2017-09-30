class restful {

    /**
     * 构造函数，传入vscode对象
     */
    constructor(_vscode, _type='output') {
        this.type = _type;
        this.vscode = _vscode;
        this.init();
    }

    /**
     * 初始化
     */
    init() {
        this.tip = require('./tip.json');

        this.editor = this.vscode.window.activeTextEditor;
        if (typeof this.editor == 'undefined') {
            this.output('001');
        }
        
        // 获取内容
        this.text = this.editor.document.getText();
        if (this.text == '') {
            this.output('002');
        }

        /**
         * 获取选择行数
         * @var selection = {
         *     "start": {
         *          "line": 1,
         *     },
         *     "end": {
         *          "line": 2  
         *     }
         * };
         */
        var selection = this.editor.selection;
        
        /**
         * 选择的字符串
         */
        this.chars = [];

        // 获取选择范围
        if (selection['start']['line'] == selection['end']['line']) { // 单行选择
            if (selection['start']['line'] == 0) {
                for (var i=0; i<this.editor.document.lineCount; i++) {
                    if (typeof this.editor.document.lineAt(i) == 'undefined') {
                        break;
                    }

                    if (this.editor.document.lineAt(i).text == '###') {
                        break;
                    }

                    // this.chars += this.editor.document.lineAt(i).text;
                    this.chars.push(this.editor.document.lineAt(i).text);
                }
            } else {
                // 选取上部分
                for (var i=0; i<selection['start']['line']; i++) {
                    // this.chars += this.editor.document.lineAt(i).text;
                    this.chars.push(this.editor.document.lineAt(i).text);

                    if (this.editor.document.lineAt(i).text == '###') {
                        // this.chars = '';
                        this.chars = [];
                    }
                }

                // 选取到下部分
                for (var i=selection['start']['line']; i<this.editor.document.lineCount; i++) {
                    if (this.editor.document.lineAt(i).text == '###') {
                        break;
                    }

                    // this.chars += this.editor.document.lineAt(i).text;
                    this.chars.push(this.editor.document.lineAt(i).text);
                }
            }
        } else { // 多行选择
            for (var i = selection['start']['line']; i <= selection['end']['line']; i++) {
                // this.chars += this.editor.document.lineAt(i).text;
                this.chars.push(this.editor.document.lineAt(i).text);
            }
        }

        // 去掉空行
        this.chars = this.clearNull(this.chars);
        
        
        // console.log(this.chars);
        // console.log(selection);
        this.valid(selection);
    }

    /**
     * 验证是否合法
     */
    valid() {
        this.params = {};

        var tmp_param = this.clearNull(this.chars[0].split(" "));
        if (
            typeof tmp_param[0] == 'undefined'
            || typeof tmp_param[1] == 'undefined'
            || typeof tmp_param[2] == 'undefined'
        ) {
            this.output('003');
        }
        this.params = {
            "method": tmp_param[0],
            "url": tmp_param[1],
            "http": tmp_param[2],
            "header": "",
            "content": ""
        };
        
        var is_header = 0;
        var is_content = 0;
        this.chars.forEach(function(e) {
            if (e == '$header') {
                is_header = 1;
                is_content = 0;
            }
            if (e == '$content') {
                is_header = 0;
                is_content = 1;
            }
            
            if (is_header == 1 && e != '$header') {
                this.params.header += e.trim();
            }
            if (is_content == 1 && e != '$content') {
                this.params.content += e.trim();
            }
        }, this);
        
        this.rest();
    }

    /**
     * rest
     */
    rest() {
        if (this.type == 'output') {
            this._outputChannel = this.vscode.window.createOutputChannel('rest');
            this._outputChannel.clear();
            this._outputChannel.show(true);
            this._outputChannel.appendLine("[Running] " + this.params.method + " "+this.params.url);
        }
        
        this.startTime = new Date();

        try {
            this.params.header = JSON.parse(this.params.header);
            this.params.content = JSON.parse(this.params.content);
        } catch (error) {
            this.errorOutputChannel(error);
            throw this.tip['004'];
        }
        
        var request = require("request");
        var options = { method: this.params.method,
            url: this.params.url,
            headers: this.params.header,
            // formData: { 
            //     'keys[timestamp]': '1234567890',
            //     'keys[packey]': '09d5d86558be11e7a7544439c44fda44',
            //     'keys[data_type]': 'json',
            //     'data[page_infos][curr_page]': '1',
            //     'data[page_infos][page_size]': '10',
            //     'data[conditions][merchant_id]': 'f09783e002ea99a1c335caf07ad921f8',
            //     'data[conditions][year_name]': '2017',
            //     'data[conditions][season_id]': '9cdea92d9cb7fb96ada1b9ae4f97e3d5',
            //     'data[conditions][sort]': 'rate' 
            // }
            formData: this.params.content
        };
        console.log(options);

        try {
            var _this = this;
            request(options, function(error, response, body) {
                if (error) {
                    _this.errorOutputChannel(error);
                    throw _this.tip['005'];
                }
    
                _this.outputChannel(response, body);
            });
        } catch (error) {
            this.errorOutputChannel(error);
            throw this.tip['005'];
        }
        
        
    }

    /**
     * error outputChannel
     */
    errorOutputChannel(error) {
        this._outputChannel.appendLine('[ERROR]');
        this._outputChannel.appendLine(error);
    }

    /**
     * outputChannel
     */
    outputChannel(response, body) {
        body = JSON.parse(body);

        this._outputChannel.appendLine('[StatusCode] ' + response.statusCode);
        this._outputChannel.appendLine('[Headers]');
        this._outputChannel.appendLine('{');
        this._outputChannel.appendLine('   "Data": "' + response.headers.date + '"');
        this._outputChannel.appendLine('   "Server": "' + response.headers.server + '"');
        if (typeof response.headers['x-powered-by'] != 'undefined') {
            this._outputChannel.appendLine('   "X-powered-by": "' + response.headers['x-powered-by'] + '"');
        }
        if (typeof response.headers['content-length'] != 'undefined') {
            this._outputChannel.appendLine('   "Content-length": ' + response.headers['content-length']);
        }
        if (typeof response.headers.connection != 'undefined') {
            this._outputChannel.appendLine('   "Connection": "' + response.headers.connection + '"');
        }
        if (typeof response.headers['content-type'] != 'undefined') {
            this._outputChannel.appendLine('   "Content-type": "' + response.headers['content-type'] + '"');
        }
        this._outputChannel.appendLine('}');

        this._outputChannel.appendLine('');
        this._outputChannel.appendLine('[Body]');
        this._outputChannel.appendLine(JSON.stringify(body));

        const endTime = new Date();
        const elapsedTime = (endTime.getTime() - this.startTime.getTime()) / 1000;

        this._outputChannel.appendLine('');
        this._outputChannel.appendLine('[Done] exited ' + elapsedTime + ' seconds');
        this._outputChannel.appendLine('');
    }

    /**
     * 去掉空行
     */
    clearNull(arr) {
        var tmp_arr = [];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] != '') {
                tmp_arr.push(arr[i]);
            }
        }

        return tmp_arr;
    }

    /**
     * output
     */
    output(code) {;
        throw this.tip[code];
    }
}

module.exports = restful;