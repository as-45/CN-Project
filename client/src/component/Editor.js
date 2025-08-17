import React, { useEffect, useRef } from 'react';
import "codemirror/mode/javascript/javascript.js";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag.js";
import "codemirror/addon/edit/closebrackets.js";
import "codemirror/lib/codemirror.css";
import CodeMirror from 'codemirror';


function Editor({socketRef, roomId, onCodeChange }) {
    const editorRef = useRef(null);
    useEffect(() => {
        const init= async() => {
            const editor= CodeMirror.fromTextArea(
                document.getElementById("realTimeEditor"),
                {
                    mode: {name:"javascript", json:true},
                    theme:"dracula",
                    autoCloseTags: true,
                    autoCloseBrackets: true,
                    lineNumbers: true,
                }
            );

            // for sync the code
            editorRef.current=editor;

            editor.setSize(null,"100%");
            editorRef.current.on("change",(instance,changes) => {
                // console.log('changes',instance,changes);
                const {origin}= changes;
                const code=instance.getValue();
                onCodeChange(code);
                
                // this will get the code from the editor
                if(origin !=='setValue'){
                    socketRef.current.emit("code-change",{
                        roomId,
                        code,
                    });
                }
            });
        };
        init();
    },[]);
    //data receive from server
    useEffect(()=> {
        if(socketRef.current){
            socketRef.current.on('code-change',({code})=> {
                    if(code!==null){
                        editorRef.current.setValue(code);
                    }
                });  
        }
        return () => {
            socketRef.current.off("code-change");
        };
    },[socketRef.current]);


  return (
  <div style={{height:"600%"}}>
    <textarea id="realTimeEditor" ></textarea>
  </div>
  )
}

export default Editor