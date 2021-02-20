import React, { useRef, useEffect, Fragment } from 'react';
import styles from './LoadFile.module.less';

export type LoadFileProps = {
  content?: string;
  filename?: string;
  onLoadContent?: (text: string, evn: ProgressEvent<FileReader>, file?: File) => void;
};

export default function LoadFile(props: LoadFileProps) {
  const { onLoadContent } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const fileReader = useRef(new FileReader());
  const fileState = useRef<File>();
  useEffect(() => {
    const inp = inputRef.current;
    if (inp) {
      fileReader.current.onload = (e) => {
        if (e.target && e.target.result) {
          onLoadContent && onLoadContent(e.target.result.toString(), e, fileState.current);
        }
      };
      inp.addEventListener('change', handleUpload, false);
    }
    return () => {
      if (inp) {
        inp.removeEventListener('change', handleUpload, false);
      }
    };
    // eslint-disable-next-line
  }, []);

  function handleUpload(eve: Event) {
    const { target } = (eve as unknown) as React.ChangeEvent<HTMLInputElement>;
    if (target.files && target.files[0]) {
      fileState.current = target.files[0];
      fileReader.current.readAsText(target.files[0]);
    }
  }

  function handleClick() {
    inputRef.current!.click();
  }

  function handleSaveAs() {
    let aTag = document.createElement('a');
    if ('download' in aTag) {
      aTag.setAttribute('download', props.filename || 'nginx.conf');
      let blob = new Blob([props.content || ''], { type: '' });
      aTag.setAttribute('href', URL.createObjectURL(blob));
      document.body.appendChild(aTag);
      const eventMouse = document.createEvent('MouseEvents');
      eventMouse.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      aTag.dispatchEvent(eventMouse);
      document.body.removeChild(aTag);
    }
  }

  return (
    <Fragment>
      {props.content && (
        <button onClick={handleSaveAs} className={styles.button}>
          Save
        </button>
      )}
      <button onClick={handleClick} className={styles.button}>
        <input type="file" multiple={false} ref={inputRef} accept="text/conf" style={{ display: 'none' }} />
        Open...
      </button>
    </Fragment>
  );
}
