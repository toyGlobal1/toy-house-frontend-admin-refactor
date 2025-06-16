import Quill from "quill";
import { useEffect, useLayoutEffect, useRef } from "react";

import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "./Editor.css";

const Editor = ({ readOnly, defaultValue, onTextChange, onSelectionChange, ref }) => {
  const containerRef = useRef(null);
  const onTextChangeRef = useRef(onTextChange);
  const onSelectionChangeRef = useRef(onSelectionChange);

  useLayoutEffect(() => {
    onTextChangeRef.current = onTextChange;
    onSelectionChangeRef.current = onSelectionChange;
  });

  useEffect(() => {
    const container = containerRef.current;
    const editorContainer = container.appendChild(container.ownerDocument.createElement("div"));
    const quill = new Quill(editorContainer, {
      theme: "snow",
      readOnly: readOnly,
      modules: {
        toolbar: readOnly ? null : undefined,
      },
    });

    ref.current = quill;

    quill.root.innerHTML = defaultValue || "";

    quill.on(Quill.events.TEXT_CHANGE, (...args) => {
      onTextChangeRef.current?.(...args);
    });

    quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
      onSelectionChangeRef.current?.(...args);
    });

    return () => {
      ref.current = null;
      container.innerHTML = "";
    };
  }, [ref, readOnly, defaultValue]);

  return <div ref={containerRef}></div>;
};

Editor.displayName = "Editor";

export default Editor;
