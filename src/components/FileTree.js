/**
 * FileTree Component
 * Σκοπός: Αναπαράσταση δομής αρχείων και φακέλων.
 * Λειτουργία: Χρήση monospace γραμματοσειράς και background για διαχωρισμό από το κυρίως κείμενο.
 */
import React from 'react';
import styles from './FileTree.module.css';

const FileTree = ({ children }) => {
  return (
    <div className="my-6 rounded-lg border border-gray-800 bg-black/30 p-4 font-mono text-[12px] text-gray-300 shadow-inner leading-snug">
      <div className={`overflow-x-auto ${styles.treeContent}`}>
        {children}
      </div>
    </div>
  );
};

export default FileTree;
