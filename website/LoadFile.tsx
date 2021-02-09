import React, { useRef, useEffect } from "react";
import styles from './LoadFile.module.less';

export type LoadFileProps = {
  onLoadContent?: (text: string, evn: ProgressEvent<FileReader>, file?: File) => void;
}

export default function LoadFile(props: LoadFileProps) {
  const { onLoadContent } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const fileReader = useRef(new FileReader());
  const fileState = useRef<File>()
  useEffect(() => {
    const inp = inputRef.current
    if (inp) {
      fileReader.current.onload = (e) => {
        if (e.target && e.target.result) {
          onLoadContent && onLoadContent(e.target.result.toString(), e, fileState.current)
        }
      }
      inp.addEventListener('change', handleUpload, false);
    }
    return () => {
      if (inp) {
        inp.removeEventListener('change', handleUpload, false);
      }
    }
    // eslint-disable-next-line
  }, []);

  function handleUpload(eve: Event) {
    const { target }  = eve as unknown as React.ChangeEvent<HTMLInputElement>;
    if (target.files && target.files[0]) {
      fileState.current = target.files[0];
      fileReader.current.readAsText(target.files[0]);
    }
  }

  function handleClick() {
    inputRef.current!.click();
  }

  return (
    <button onClick={handleClick} className={styles.button}>
      <input type="file" multiple={false} ref={inputRef} accept="text/conf" style={{ display: 'none' }} />
      Open...
    </button>
  );
}