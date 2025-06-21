    async function fetchOrgStats(orgSlug) {
      let totalDownloads = 0;
      let totalFollowers = 0;
      let offset = 0;
      const limit = 100;
      let allProjects = [];

      while (true) {
        const res = await fetch(`https://api.modrinth.com/v2/search?facets=${encodeURIComponent('[["author:' + orgSlug + '"]]')}&offset=${offset}&limit=${limit}`);
        const data = await res.json();
        const projects = data.hits;

        allProjects = allProjects.concat(projects);
        projects.forEach(project => {
          totalDownloads += project.downloads;
        });

        if (projects.length < limit) break;
        offset += limit;
      }

      for (const project of allProjects) {
        const projRes = await fetch(`https://api.modrinth.com/v2/project/${project.slug}`);
        const projData = await projRes.json();
        totalFollowers += projData.followers;
      }

      document.getElementById("download-count").textContent =
        `Total downloads: ${totalDownloads.toLocaleString()}, Total followers: ${totalFollowers.toLocaleString()}`;
    }

    fetchOrgStats("jujucorp").catch(err => {
      console.error("Failed to fetch org stats", err);
      document.getElementById("download-count").textContent = "Failed to load stats.";
    });