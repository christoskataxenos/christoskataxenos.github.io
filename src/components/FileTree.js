/**
 * FileTree Component
 * Σκοπός: Αναπαράσταση δομής αρχείων και φακέλων.
 * Λειτουργία: Χρήση monospace γραμματοσειράς και background για διαχωρισμό από το κυρίως κείμενο.
 */
import React from 'react';
import styles from './FileTree.module.css';

const FileTree = ({ children }) => {
  return (
    <div className="file-tree my-6 rounded-lg border border-gray-800 bg-black/30 p-4 font-mono text-[11px] sm:text-[12px] text-gray-300 shadow-inner leading-snug">
      <style jsx>{`
        .file-tree :global(ul), .file-tree :global(li), .file-tree :global(p) {
          margin: 0 !important;
          padding: 0 !important;
          list-style: none !important;
          font-size: inherit !important;
          line-height: inherit !important;
          color: inherit !important;
        }
        .file-tree :global(li) {
          padding-left: 0 !important;
        }
      `}</style>
      <div className={`overflow-x-auto ${styles.treeContent}`}>
        {children}
      </div>
    </div>
  );
};

export default FileTree;
