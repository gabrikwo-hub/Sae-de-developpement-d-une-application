const form = document.getElementById('contact');
const statut = document.getElementById('statut');

const regles = {
    nom: v => v.trim() ? '' : 'Veuillez indiquer votre nom.',
    prenom: v => v.trim() ? '' : 'Veuillez indiquer votre prénom.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Veuillez saisir une adresse mail valide.',
    tel: v => /^\+?[0-9 .()-]{6,}$/.test(v.trim()) ? '' : 'Veuillez saisir un numéro de téléphone valide.',
    objet: v => v.trim() ? '' : 'Veuillez indiquer l’objet du message.',
    message: v => v.trim() ? '' : 'Veuillez écrire votre message.'
};

function valider(champ) {
    const message = regles[champ.name](champ.value);
    champ.classList.toggle('invalide', !!message);
    champ.parentElement.querySelector('.erreur').textContent = message;
    return !message;
}

Object.keys(regles).forEach(nom => {
    const champ = form.elements[nom];
    champ.addEventListener('blur', () => valider(champ));
    champ.addEventListener('input', () => champ.classList.contains('invalide') && valider(champ));
});

form.addEventListener('submit', e => {
    e.preventDefault();
    statut.textContent = '';

    let ok = Object.keys(regles).map(nom => valider(form.elements[nom])).every(Boolean);

    const consent = form.elements.consentement;
    const errConsent = document.getElementById('erreur-consentement');
    errConsent.textContent = consent.checked ? '' : 'Votre accord est nécessaire pour envoyer le formulaire.';
    ok = ok && consent.checked;

    if (!ok) {
        form.querySelector('.invalide, #consentement:not(:checked)')?.focus();
        return;
    }

    const donnees = Object.fromEntries(new FormData(form));
    console.log(donnees);
    // TODO : envoyer données au serveur (mission 4/5 ?)
    statut.textContent = 'Votre message a bien été envoyé.';
    form.reset();
});