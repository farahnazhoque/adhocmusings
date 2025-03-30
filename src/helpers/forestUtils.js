function getNoteIcon(note) {
  // Determine note type and icon based on metadata
  if (note.data.tags && note.data.tags.includes('reading')) {
    return { icon: 'stone', height: 25 };
  }
  if (note.data.tags && note.data.tags.includes('tool')) {
    return { icon: 'chest', height: 25 };
  }
  if (note.data.tags && note.data.tags.includes('index')) {
    return { icon: 'signpost', height: 25 };
  }
  if (note.data.tags && note.data.tags.includes('outdated')) {
    return { icon: 'withered', height: 25 };
  }
  
  // Default to tree icons based on content length
  const contentLength = note.template.frontMatter.content.length;
  if (contentLength < 500) {
    return { icon: 'tree-1', height: 15 };
  } else if (contentLength < 2000) {
    return { icon: 'tree-2', height: 25 };
  } else {
    return { icon: 'tree-3', height: 35 };
  }
}

function organizeNotesIntoRows(notes) {
  const rows = [];
  let currentRow = [];
  const maxNotesPerRow = 15;
  
  notes.forEach((note, index) => {
    if (currentRow.length >= maxNotesPerRow) {
      rows.push(currentRow);
      currentRow = [];
    }
    
    // Add empty space every few notes for visual balance
    if (currentRow.length > 0 && currentRow.length % 3 === 0) {
      currentRow.push({ type: 'plane' });
    }
    
    currentRow.push({
      type: 'note',
      url: note.url,
      title: note.data.title || note.fileSlug,
      ...getNoteIcon(note)
    });
  });
  
  if (currentRow.length > 0) {
    rows.push(currentRow);
  }
  
  return rows;
}

function getForestStats(notes) {
  const stats = {
    'tree-1': 0,
    'tree-2': 0,
    'tree-3': 0,
    'stone': 0,
    'chest': 0,
    'signpost': 0,
    'withered': 0
  };
  
  notes.forEach(note => {
    const { icon } = getNoteIcon(note);
    stats[icon]++;
  });
  
  return Object.entries(stats).map(([icon, count]) => ({
    icon,
    count,
    label: icon === 'tree-1' ? 'Seedlings' :
           icon === 'tree-2' ? 'Saplings' :
           icon === 'tree-3' ? 'Trees' :
           icon === 'stone' ? 'Stones' :
           icon === 'chest' ? 'Chests' :
           icon === 'signpost' ? 'Signposts' :
           'Withered'
  }));
}

function forestData(data) {
  const notes = data.collections.note || [];
  const visibleNotes = notes.filter(note => !note.data.hide);
  
  return {
    rows: organizeNotesIntoRows(visibleNotes),
    stats: getForestStats(visibleNotes)
  };
}

module.exports = {
  forestData
}; 