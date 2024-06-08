import { useState } from 'react';
import '@wcj/dark-mode';
import styles from 'Header.module.less';
import LoadFile, { LoadFileProps } from './LoadFile';
// @ts-ignore
import { ReactComponent } from './github.svg';
// @ts-ignore
import { ReactComponent as NginxLogo } from './nginx.svg';

type HeaderProps = LoadFileProps & {};

export default function Header(props: HeaderProps) {
  const { onLoadContent } = props;
  const [filename, setFilename] = useState('nginx.example.conf');
  return (
    <div className={styles.header}>
      <NginxLogo />
      <div className={styles.title}>nginx editor</div>
      <div className={styles.filename}>{filename}</div>
      <LoadFile
        content={props.content}
        filename={filename}
        onLoadContent={(text, evn, file) => {
          setFilename(file!.name || '');
          onLoadContent && onLoadContent(text, evn);
        }}
      />
      <dark-mode permanent></dark-mode>
      <a href="https://github.com/jaywcjlove/nginx-editor" target="__blank" style={{ marginLeft: 6 }}>
        <ReactComponent />
      </a>
    </div>
  );
}
