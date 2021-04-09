const compile = document.querySelector('button');
const textarea = document.getElementById("c-code");
const select = document.querySelector('select');
const url = 'https://api.jdoodle.com/v1/execute';
const output = document.querySelector('.output > p');
const proxy = "http://www.hiyiguo.cn:8081/";
let start = 1;

function addScript(){
    document.write("<script language=javascript src="+"codemirror-5.59.4/lib/codemirror.js"+"></script>");
    document.write("<script language=javascript src="+"codemirror-5.59.4/addon/edit/matchbrackets.js"+"></script>");
    document.write("<script language=javascript src="+"codemirror-5.59.4/addon/hint/show-hint.js"+"></script>");
    document.write("<script language=javascript src="+"codemirror-5.59.4/mode/clike/clike.js"+"></script>");
}

var editor = CodeMirror.fromTextArea(document.getElementById("c-code"), {
    lineNumbers: true,
    styleActiveLine: true,
    matchBrackets: true,
    indentUnit: 4,
    mode: "text/x-csrc"
  });

  var stdin = CodeMirror.fromTextArea(document.getElementById("stdinput"), {
    lineNumbers: true,
    matchBrackets: true,
    smartIndent: false,
    mode: "text/plain"
  });

  var stdout = CodeMirror.fromTextArea(document.getElementById("stdoutput"), {
    lineNumbers: true,
    matchBrackets: true,
    smartIndent: false,
    mode: "text/plain"
  });
  
  var mac = CodeMirror.keyMap.default == CodeMirror.keyMap.macDefault;
  CodeMirror.keyMap.default[(mac ? "Cmd" : "Ctrl") + "-Space"] = "autocomplete";
  var input = document.getElementById("select");
  function selectTheme() {
      var theme = input.options[input.selectedIndex].textContent;
      editor.setOption("theme", theme);
      location.hash = "#" + theme;
  }
  var choice = (location.hash && location.hash.slice(1)) ||
              (document.location.search &&
                  decodeURIComponent(document.location.search.slice(1)));
  if (choice) {
      input.value = choice;
      editor.setOption("theme", choice);
  }
  CodeMirror.on(window, "hashchange", function() {
      var theme = location.hash.slice(1);
      if (theme) { input.value = theme; selectTheme(); }
  });

select.addEventListener('change', () => {
    //console.log('change', select.value);
    switch(select.value) {
        case 'c99':
            textarea.value = `#include <stdio.h>\n\nint main() {\n // Write your code here\n    printf("Hello World");\n}`
            editor.setValue(textarea.value)
            break;
        case 'cpp':
            textarea.value = `#include <iostream>\nusing namespace std;\n\nint main() {\n // Write your code here\n    cout<<"Hello World"<<endl;\n}`
            editor.setValue(textarea.value)
            break;        
        case 'java':
            textarea.value = `public class Main {\n  public static void main(String[] args) {\n   // Write your code here\n     System.out.println("Hello World");\n }\n}`
            editor.setValue(textarea.value)
            break;
    }
    console.log(textarea.value);
});


compile.addEventListener('click', async () => {
    const code = editor.getValue();
    //console.log(code);
    const langId = select.value;
    const stdinput = stdin.getValue();
    //console.log(langId);
    stdout.setValue("正在编译中......");
    
    var xhr = new XMLHttpRequest();
    xhr.open("POST",proxy + url,true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                //console.log(xhr);
                //console.log(xhr.response);
                var data = xhr.response;
                var resultJson = JSON.parse(data);
                var resultOut = resultJson.output;
                //console.log(resultJson + " " +typeof(resultJson));
                //console.log(resultOut + " " +typeof(resultOut));
                stdout.setValue(resultOut);
            }
        }
    };
    xhr.send(JSON.stringify({
        clientId: "1360c6212a831bb84d238b30202b0660",
        clientSecret:"709a49b9a4526dabd0cdad61368ae48a078090deed2d8ccc7163880bc00b53b8",
        script : code,
        stdin : stdinput,
        language: langId,
        versionIndex: "0"
    }));
});