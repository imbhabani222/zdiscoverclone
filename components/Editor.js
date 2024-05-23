import React, { useEffect, useRef } from "react";
const toolbarConfig={
    fontColor: {
        colors: [
            {
                color: 'hsl(0, 0%, 0%)',
                label: 'Black'
            },
            {
                color: 'hsl(0, 0%, 30%)',
                label: 'Dim grey'
            },
            {
                color: 'hsl(0, 0%, 60%)',
                label: 'Grey'
            },
            {
                color: 'hsl(0, 0%, 90%)',
                label: 'Light grey'
            }
        ]},
        fontBackgroundColor: {
            colors: [
                {
                    color: 'hsl(0, 75%, 60%)',
                    label: 'Red'
                },
                {
                    color: 'hsl(30, 75%, 60%)',
                    label: 'Orange'
                },
                {
                    color: 'hsl(60, 75%, 60%)',
                    label: 'Yellow'
                },
                {
                    color: 'hsl(90, 75%, 60%)',
                    label: 'Light green'
                },
                {
                    color: 'hsl(120, 75%, 60%)',
                    label: 'Green'
                },

                // ...
            ]
        },
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        '|',
        'fontColor',
        '|',
        'italic',
        '|',
        'link',
        '|',
        'underline',
        '|',
        'strikethrough',
        '|',
        'superscript',
        'subscript',
      '|',
        'bulletedList',
        'numberedList',
        '|',
        'insertTable',
        '|',
        'fontBackgroundColor',
        '|',
        'undo',
        'redo'
      ]
    },
    // image: {
    //   toolbar: [
    //     'imageStyle:full',
    //     'imageStyle:side',
    //     '|',
    //     'imageTextAlternative'
    //   ]
    // },
    table: {
      contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
    },
    language: 'en',
    
  };
function Editor({ onChange, editorLoaded, name, value }) {
  const editorRef = useRef();
  const { CKEditor, ClassicEditor } = editorRef.current || {};

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor, // v3+
      ClassicEditor: require("@ckeditor/ckeditor5-build-classic")
    };
  }, []);

  return (
    <div>
      {editorLoaded && 
        <CKEditor
          config={toolbarConfig}
          type=""
          name={name}
          editor={ClassicEditor}
          data={value}
          onChange={(event, editor) => {
            const data = editor.getData();
            // console.log({ event, editor, data })
            onChange(data);
          }}
        />}
    </div>
  );
}

export default Editor;