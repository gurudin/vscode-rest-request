class intelliSense {
    /**
     * 构造函数，传入vscode对象
     */
    constructor(_vscode) {
        this._vscode = _vscode;
        this.init();
    }

    init() {
        console.log('intelliSense');

        var completionItems = [];
        var completionItem = new this._vscode.CompletionItem("aaa");
        completionItem.kind = this._vscode.CompletionItemKind.Snippet;
        completionItem.detail = "aaa";
        completionItem.filterText = "bbbb";
        completionItem.insertText = new this._vscode.SnippetString("aaaa$1bbbb$2cccc");
        completionItems.push(completionItem);

        return completionItems;
    }
}

module.exports = intelliSense;