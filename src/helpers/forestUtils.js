function getNoteIcon(note) {
  // Determine note type and icon based on metadata
  if (note.data.tags && note.data.tags.includes('reading')) {
    return { icon: '6', height: 25 };
  }
  if (note.data.tags && note.data.tags.includes('tool')) {
    return { icon: '8', height: 25 };
  }
  if (note.data.tags && note.data.tags.includes('index')) {
    return { icon: '7', height: 25 };
  }
  if (note.data.tags && note.data.tags.includes('outdated')) {
    return { icon: '5', height: 25 };
  }
  
  // Default to tree icons based on content length
  const contentLength = note.template.frontMatter.content.length;
  if (contentLength < 500) {
    return { icon: '1', height: 15 };
  } else if (contentLength < 2000) {
    return { icon: '2', height: 25 };
  } else if (contentLength < 5000) {
    return { icon: '3', height: 35 };
  } else {
    return { icon: '4', height: 45 };
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
    '1': 0,
    '2': 0,
    '3': 0,
    '4': 0,
    '5': 0,
    '6': 0,
    '7': 0,
    '8': 0
  };
  
  notes.forEach(note => {
    const { icon } = getNoteIcon(note);
    stats[icon]++;
  });
  
  return Object.entries(stats).map(([icon, count]) => ({
    icon,
    count,
    label: icon === '1' ? 'Stellar Nebulas' :
           icon === '2' ? 'Stars' :
           icon === '3' ? 'Red Giants' :
           icon === '4' ? 'Supernovae' :
           icon === '5' ? 'Black Holes' :
           icon === '6' ? 'Galaxies' :
           icon === '7' ? 'Telescopes' :
           'Satellites'
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