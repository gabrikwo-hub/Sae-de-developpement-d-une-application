/* ADEPA – Recherche et filtrage dynamique de la page Recherche et études */
(() => {
    'use strict';

    const input = document.getElementById('research-input');
    const clearBtn = document.getElementById('research-clear');
    const yearSelect = document.getElementById('research-year');
    const status = document.getElementById('research-status');
    const emptyBox = document.getElementById('research-empty');
    const resetBtn = document.getElementById('research-reset');
    const cards = Array.from(document.querySelectorAll('.post-list .post-card'));

    if (!input || !cards.length) return;

    /* Normalise le texte (minuscules + suppression des accents) */
    const normalize = (str) =>
        (str || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim();

    /* Indexation automatique de chaque carte présente dans le HTML */
    const years = new Set();
    const items = cards.map((card) => {
        const title = card.querySelector('.post-card__title')?.textContent || '';
        const excerpt = card.querySelector('.post-card__excerpt')?.textContent || '';
        const timeEl = card.querySelector('time');
        const dateAttr = timeEl?.getAttribute('datetime') || timeEl?.textContent || '';
        const yearMatch = dateAttr.match(/\b(19|20)\d{2}\b/);
        const year = yearMatch ? yearMatch[0] : '';
        const keywords = card.dataset.keywords || '';

        if (year) years.add(year);

        return {
            card,
            year,
            searchableText: normalize(`${title} ${excerpt} ${year} ${keywords}`)
        };
    });

    /* Remplissage automatique du sélecteur d'années */
    if (yearSelect) {
        Array.from(years)
            .sort((a, b) => b.localeCompare(a))
            .forEach((year) => {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                yearSelect.appendChild(option);
            });
    }

    /* Filtrage en temps réel */
    const filterDocuments = () => {
        const query = normalize(input.value);
        const terms = query ? query.split(/\s+/) : [];
        const selectedYear = yearSelect ? yearSelect.value : '';
        let visibleCount = 0;

        if (clearBtn) {
            clearBtn.hidden = input.value.length === 0;
        }

        items.forEach(({ card, year, searchableText }) => {
            const matchesYear = !selectedYear || year === selectedYear;
            const matchesTerms = terms.every((term) => searchableText.includes(term));
            const isVisible = matchesYear && matchesTerms;

            card.hidden = !isVisible;
            if (isVisible) visibleCount += 1;
        });

        const isFiltered = terms.length > 0 || Boolean(selectedYear);

        if (status) {
            if (!isFiltered) {
                status.textContent = `${cards.length} documents disponibles`;
            } else if (visibleCount === 0) {
                status.textContent = '0 document trouvé';
            } else {
                const label = visibleCount > 1 ? 'documents trouvés' : 'document trouvé';
                status.textContent = `${visibleCount} ${label} sur ${cards.length}`;
            }
        }

        if (emptyBox) {
            emptyBox.hidden = visibleCount > 0;
        }
    };

    /* Événements utilisateur */
    input.addEventListener('input', filterDocuments);

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && input.value) {
            input.value = '';
            filterDocuments();
        }
    });

    if (yearSelect) {
        yearSelect.addEventListener('change', filterDocuments);
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            input.value = '';
            input.focus();
            filterDocuments();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            input.value = '';
            if (yearSelect) yearSelect.value = '';
            input.focus();
            filterDocuments();
        });
    }

    /* Initialisation du compteur au chargement */
    filterDocuments();
})();