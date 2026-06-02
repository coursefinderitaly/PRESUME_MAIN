const fs = require('fs');
const file = 'src/components/AppointmentForm.jsx';
let content = fs.readFileSync(file, 'utf8');

// Ensure text is centered in the header
content = content.replace('text-center md:text-left', 'text-center w-full');
content = content.replace('text-center md:text-left', 'text-center w-full');

// Ensure the container itself centers the items
content = content.replace(
  '<div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 md:gap-0">',
  '<div className="flex flex-col items-center justify-center mb-8 gap-4">'
);
content = content.replace(
  '<div className="flex items-center gap-4">',
  '<div className="flex flex-col items-center gap-4">'
);

fs.writeFileSync(file, content, 'utf8');
