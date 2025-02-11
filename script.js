	const grid = document.getElementById('content-container');
	const masonry = new Masonry(grid, {
    itemSelector: '.card',
    gutter: 20, // Adjust the gutter size
    fitWidth: true
});
      const inventionsBtn = document.getElementById('inventionsBtn');
      const spaceProjectsBtn = document.getElementById('spaceProjectsBtn');
      const contentContainer = document.getElementById('content-container');
      const searchInput = document.getElementById('searchInput');

      let jsonData = null;
      let currentDisplay = 'inventions'; // Track the current display

      async function loadData() {
        try {
          const response = await fetch('data.json'); // Make sure data.json is in the same directory
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          jsonData = await response.json();
          displayInventions();
        } catch (error) {
          console.error('Failed to load data:', error);
          contentContainer.innerHTML = '<p>Failed to load data.</p>';
        }
      }


      function filterData(data, searchTerm) {
        if (!searchTerm) return data;
        const lowerSearchTerm = searchTerm.toLowerCase();
        return data.filter(item => {
          const values = Object.values(item);
          return values.some(value => {
            if (Array.isArray(value)) {
              return value.some(subValue => String(subValue).toLowerCase().includes(lowerSearchTerm));
            }
            return String(value).toLowerCase().includes(lowerSearchTerm);
          });
        });
      }

      function displayInventions(searchTerm = null) {
        if (!jsonData) return;
          currentDisplay = 'inventions';
          inventionsBtn.classList.add('active');
          spaceProjectsBtn.classList.remove('active');

        contentContainer.innerHTML = '';
        const filteredInventions = filterData(jsonData.data.inventions, searchTerm);

        filteredInventions.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <h2>${item.name}</h2>
                <p><strong>Inventor:</strong> ${Array.isArray(item.inventor) ? item.inventor.join(', ') : item.inventor}</p>
                <p><strong>Date:</strong> ${item.date}</p>
                <p><strong>Field:</strong> ${item.field}</p>
                <p><strong>Description:</strong> ${item.description}</p>
                ${item.materials && item.materials.length > 0 ? `<p><strong>Materials:</strong> ${item.materials.join(', ')}</p>` : ''}
                ${item.applications && item.applications.length > 0 ? `<p><strong>Applications:</strong> ${item.applications.join(', ')}</p>` : ''}
                ${item.patents && item.patents.length > 0 ? `<p><strong>Patents:</strong> ${item.patents.join(', ')}</p>` : ''}
                  ${item.images && item.images.length > 0 ?
                            item.images.map(image => `<img src="${image}" alt="${item.name} image">`).join('')
                       : ''}
                        ${item.references && item.references.length > 0 ?
                            `<strong>References:</strong>
                             <ul>${item.references.map(reference => `<li><a href="${reference.url}" target="_blank">${reference.type}</a></li>`).join('')}</ul>`
                            : ''}
            `;
            contentContainer.appendChild(card);
        });
      }

      function displaySpaceProjects(searchTerm = null) {
        if (!jsonData) return;
           currentDisplay = 'spaceProjects';
          spaceProjectsBtn.classList.add('active');
          inventionsBtn.classList.remove('active');


        contentContainer.innerHTML = '';
        const filteredProjects = filterData(jsonData.data.space_projects, searchTerm);
        filteredProjects.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
               <h2>${item.name}</h2>
                <p><strong>Agency:</strong> ${Array.isArray(item.agency) ? item.agency.join(', ') : item.agency}</p>
                <p><strong>Date:</strong> ${item.date}</p>
                <p><strong>Description:</strong> ${item.description}</p>
               ${item.objectives && item.objectives.length > 0 ? `<p><strong>Objectives:</strong> ${item.objectives.join(', ')}</p>` : ''}
                ${item.crew && item.crew.length > 0 ? `<p><strong>Crew:</strong> ${item.crew.join(', ')}</p>` : ''}
                ${item.launch_vehicle ? `<p><strong>Launch Vehicle:</strong> ${item.launch_vehicle}</p>` : ''}
                ${item.payload && item.payload.length > 0 ? `<p><strong>Payload:</strong> ${item.payload.join(', ')}</p>` : ''}
                 ${item.outcomes && item.outcomes.length > 0 ? `<p><strong>Outcomes:</strong> ${item.outcomes.join(', ')}</p>` : ''}
                ${item.images && item.images.length > 0 ?
                            item.images.map(image => `<img src="${image}" alt="${item.name} image">`).join('')
                       : ''}
                     ${item.references && item.references.length > 0 ?
                            `<strong>References:</strong>
                             <ul>${item.references.map(reference => `<li><a href="${reference.url}" target="_blank">${reference.type}</a></li>`).join('')}</ul>`
                            : ''}
            `;
            contentContainer.appendChild(card);
        });
      }



      inventionsBtn.addEventListener('click', () => displayInventions(searchInput.value));
      spaceProjectsBtn.addEventListener('click', () => displaySpaceProjects(searchInput.value));


      searchInput.addEventListener('input', () => {
          if (currentDisplay === 'inventions') {
              displayInventions(searchInput.value);
          } else {
              displaySpaceProjects(searchInput.value);
          }
      });

      // Initially load data and display inventions
      loadData();
