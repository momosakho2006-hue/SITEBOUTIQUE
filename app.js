const defaultProducts = [
    // --- PRODUITS VENDUS AU DÉTAIL (8 cartes = 2 lignes de 4) ---
    { id: 1, type: "detail", name: "Poulet de chair (Unité)", category: "Poulet de chair", price: 3500, img: "https://unsplash.com", desc: "Poids vif 2kg à 2.5kg, prêt à consommer." },
    { id: 2, type: "detail", name: "Poulet local fermier", category: "Poulet local", price: 4500, img: "https://unsplash.com", desc: "Élevé en plein air, chair ferme et savoureuse." },
    { id: 3, type: "detail", name: "Coq local adulte", category: "Poulet local", price: 6000, img: "https://unsplash.com", desc: "Gros gabarit élevé naturellement en liberté." },
    { id: 4, type: "detail", name: "Poulet Rainbow (Unité)", category: "Poulet Rainbow", price: 4000, img: "https://unsplash.com", desc: "Race mixte rustique, excellente qualité de chair." },
    { id: 5, type: "detail", name: "Poule d'ornement Brahma", category: "Ornement", price: 25000, img: "https://unsplash.com", desc: "Magnifique plumage, idéale pour décoration de cour." },
    { id: 6, type: "detail", name: "Canard de Barbarie", category: "Canard", price: 7000, img: "https://unsplash.com", desc: "Canard adulte de belle taille, élevé à la ferme." },
    { id: 7, type: "detail", name: "Dinde fermière (Unité)", category: "Dinde", price: 18000, img: "https://unsplash.com", desc: "Gros gabarit, idéale pour les fêtes et réceptions." },
    { id: 8, type: "detail", name: "Pintade grise locale", category: "Pintade", price: 5000, img: "https://unsplash.com", desc: "Pintade adulte élevée en liberté." },

    // --- PRODUITS VENDUS PAR LOTS (8 cartes = 2 lignes de 4) ---
    { id: 9, type: "lot", name: "Lot de 50 Poussins Chair", category: "Poussins", price: 27500, img: "image/poussin.jpg", desc: "Poussins d'un jour vaccinés (550 FCFA / unité)." },
    { id: 10, type: "lot", name: "Lot de 100 Poussins Ponte", category: "Poussins", price: 65000, img: "image/poussin.jpg", desc: "Lot complet prêt pour démarrage d'élevage ponte." },
    { id: 11, type: "lot", name: "Lot de 50 Poussins Rainbow", category: "Poussins", price: 32500, img:"image/poussin.jpg", desc: "Poussins robustes adaptés au climat local." },
    { id: 12, type: "lot", name: "Lot de 5 Cailles de chair", category: "Caille", price: 5000, img: "image/barquettedecaille.jpg", desc: "Cailles grasses prêtes à la consommation." },
    { id: 13, type: "lot", name: "Lot de 10 Cailles pondeuses", category: "Caille", price: 12000, img:"image/CAILLE.jpg" , desc: "En pleine période de ponte quotidienne." },
    { id: 14, type: "lot", name: "Lot de 10 Poulets de chair", category: "Poulet de chair", price: 32000, img:"image/pouletde chair.jpg" , desc: "Tarif grossiste pour restaurants et cérémonies." },
    { id: 15, type: "lot", name: "Lot de 10 Poulets Rainbow", category: "Poulet Rainbow", price: 37000, img:"image/BRAHMA.jpg" , desc: "Pack de 10 volailles adultes à prix réduit." },
    { id: 16, type: "lot", name: "Lot de 5 Poulets locaux", category: "Poulet local", price: 21000, img: "image/BRAHMA.jpg", desc: "Lot familial de 5 poulets fermiers." }
];

let products = JSON.parse(localStorage.getItem('aviculture_products_final')) || defaultProducts;
let cart = JSON.parse(localStorage.getItem('aviculture_cart')) || [];
let orders = JSON.parse(localStorage.getItem('aviculture_orders')) || [];

function saveData() {
    localStorage.setItem('aviculture_products_final', JSON.stringify(products));
    localStorage.setItem('aviculture_cart', JSON.stringify(cart));
    localStorage.setItem('aviculture_orders', JSON.stringify(orders));
    updateCartBadge();
}

function updateCartBadge() {
    const badge = document.getElementById('cart-count');
    if (badge) {
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        badge.textContent = totalItems;
    }
}

function renderCatalog(filter = 'Tout', pageType = 'detail') {
    const container = document.getElementById('products-container');
    if (!container) return;

    container.innerHTML = ''; 
    const byPageType = products.filter(p => p.type === pageType);
    const filtered = filter === 'Tout' ? byPageType : byPageType.filter(p => p.category === filter);

    filtered.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'card';
        const imageUrl = prod.img || 'https://unsplash.com';
        const badgeLabel = prod.type === 'lot' ? 'Par Lot' : 'Détail';

        card.innerHTML = 
            '<div class="card-img-wrapper">' +
                '<img src="' + imageUrl + '" alt="' + prod.name + '" class="card-img">' +
                '<span class="card-badge">' + badgeLabel + '</span>' +
            '</div>' +
            '<div class="card-body">' +
                '<div>' +
                    '<span class="card-category">' + prod.category + '</span>' +
                    '<h3>' + prod.name + '</h3>' +
                    '<p class="card-desc">' + prod.desc + '</p>' +
                '</div>' +
                '<div>' +
                    '<div class="card-price">' + prod.price.toLocaleString() + ' FCFA</div>' +
                    '<button class="btn" onclick="addToCart(' + prod.id + ')">Ajouter au panier</button>' +
                '</div>' +
            '</div>';
        container.appendChild(card);
    });
}

function filterProducts(category, pageType) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.includes(category) || (category === 'Tout' && btn.textContent.includes('Tout'))) {
            btn.classList.add('active');
        }
    });
    renderCatalog(category, pageType);
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    saveData();
    alert('"' + product.name + '" a été ajouté à votre panier.');
}
function renderCart() {
    const tbody = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    if (!tbody || !totalEl) return;

    tbody.innerHTML = '';
    let grandTotal = 0;

    if (cart.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Votre panier est vide.</td></tr>';
        totalEl.textContent = '0 FCFA';
        return;
    }

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        grandTotal += itemTotal;
        const typeText = item.type === 'lot' ? 'Lot' : 'Détail';

        const tr = document.createElement('tr');
        tr.innerHTML = 
            '<td><strong>' + item.name + '</strong></td>' +
            '<td>' + typeText + '</td>' +
            '<td>' + item.price.toLocaleString() + ' FCFA</td>' +
            '<td>' +
                '<input type="number" min="1" value="' + item.qty + '" class="qty-input" ' +
                'onchange="updateQty(' + index + ', this.value)">' +
            '</td>' +
            '<td>' + itemTotal.toLocaleString() + ' FCFA</td>' +
            '<td><button class="btn btn-danger" onclick="removeFromCart(' + index + ')">X</button></td>';
        tbody.appendChild(tr);
    });

    totalEl.textContent = grandTotal.toLocaleString() + ' FCFA';
}

function renderClientHistory() {
    const historyList = document.getElementById('client-history-list');
    if (!historyList) return;

    historyList.innerHTML = '';
    if (orders.length === 0) {
        historyList.innerHTML = '<tr><td colspan="6" class="text-center">Vous n\'avez pas encore effectué d\'achat.</td></tr>';
        return;
    }

    orders.forEach(order => {
        const itemsSummary = order.items.map(i => i.qty + 'x ' + i.name).join('<br>');
        const statusClass = order.status === 'Livrée / Récupérée' ? 'status-badge valide' : 'status-badge';
        const orderRef = order.orderNumber || ('#' + order.id);

        const tr = document.createElement('tr');
        tr.innerHTML = 
            '<td><strong>' + orderRef + '</strong></td>' +
            '<td>' + order.date + '</td>' +
            '<td>' + itemsSummary + '</td>' +
            '<td><strong>' + order.total.toLocaleString() + ' FCFA</strong></td>' +
            '<td>' + order.payment + '</td>' +
            '<td><span class="' + statusClass + '">' + order.status + '</span></td>';
        historyList.appendChild(tr);
    });
}

function updateQty(index, newQty) {
    const qty = parseInt(newQty);
    if (qty > 0) {
        cart[index].qty = qty;
        saveData();
        renderCart();
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveData();
    renderCart();
}

function toggleWaveInfo() {
    const waveRadio = document.querySelector('input[name="payment"][value="Wave"]');
    const waveDiv = document.getElementById('wave-details');
    if (waveDiv) {
        waveDiv.style.display = waveRadio && waveRadio.checked ? 'block' : 'none';
    }
}

const checkoutForm = document.getElementById('checkout-form');
if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (cart.length === 0) {
            alert("Votre panier est vide !");
            return;
        }

        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
        const waveRef = document.getElementById('wave-ref').value;
        const randomCode = Math.floor(1000 + Math.random() * 9000);

        const newOrder = {
            id: Date.now(),
            orderNumber: 'CMD-' + randomCode,
            date: new Date().toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            clientName: document.getElementById('client-name').value,
            clientPhone: document.getElementById('client-phone').value,
            clientAddress: document.getElementById('client-address').value || "Non précisée",
            items: [...cart],
            total: cart.reduce((sum, item) => sum + (item.price * item.qty), 0),
            payment: paymentMethod === 'Wave' && waveRef ? 'Wave (Réf: ' + waveRef + ')' : paymentMethod,
            status: 'En attente'
        };

        orders.unshift(newOrder);
        cart = [];
        saveData();
        checkoutForm.reset();
        toggleWaveInfo();
        renderCart();
        renderClientHistory();
        
        alert('Commande ' + newOrder.orderNumber + ' enregistrée ! Retrouvez-la dans votre historique ci-dessous.');
    });
}

function renderAdmin() {
    const prodList = document.getElementById('admin-products-list');
    const pendingList = document.getElementById('admin-pending-orders');
    const salesHistoryList = document.getElementById('admin-sales-history');

    if (prodList) {
        prodList.innerHTML = '';
        products.forEach((prod, index) => {
            const pageLabel = prod.type === 'lot' ? 'Lots' : 'Détail';
            const thumbUrl = prod.img || 'image/pouletde chair.jpg';
            const tr = document.createElement('tr');
            tr.innerHTML = 
                '<td><img src="' + thumbUrl + '" class="admin-thumb" alt="photo"></td>' +
                '<td><strong>' + prod.name + '</strong></td>' +
                '<td>' + pageLabel + '</td>' +
                '<td>' + prod.price.toLocaleString() + ' FCFA</td>' +
                '<td>' +
                    '<button class="btn btn-edit" onclick="editProduct(' + prod.id + ')">Modifier</button>' +
                    '<button class="btn btn-danger" onclick="deleteProduct(' + index + ')">Supprimer</button>' +
                '</td>';
            prodList.appendChild(tr);
        });
    }

    if (pendingList && salesHistoryList) {
        pendingList.innerHTML = '';
        salesHistoryList.innerHTML = '';

        const pendingOrders = orders.filter(o => o.status === 'En attente');
        const completedOrders = orders.filter(o => o.status === 'Livrée / Récupérée');

        const statPending = document.getElementById('stat-pending');
        const statCompleted = document.getElementById('stat-completed');
        const statRevenue = document.getElementById('stat-revenue');

        if (statPending) statPending.textContent = pendingOrders.length;
        if (statCompleted) statCompleted.textContent = completedOrders.length;
        if (statRevenue) {
            const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
            statRevenue.textContent = totalRevenue.toLocaleString() + ' FCFA';
        }

        if (pendingOrders.length === 0) {
            pendingList.innerHTML = '<tr><td colspan="6" class="text-center">Aucune commande en attente.</td></tr>';
        } else {
            pendingOrders.forEach(order => {
                const itemsSummary = order.items.map(i => i.qty + 'x ' + i.name).join('<br>');
                const orderRef = order.orderNumber || '';
                const tr = document.createElement('tr');
                tr.innerHTML = 
                    '<td><strong>' + orderRef + '</strong><br><small>' + order.date + '</small></td>' +
                    '<td><strong>' + order.clientName + '</strong><br>' + order.clientPhone + '<br><small>' + order.clientAddress + '</small></td>' +
                    '<td>' + itemsSummary + '</td>' +
                    '<td><strong>' + order.total.toLocaleString() + ' FCFA</strong></td>' +
                    '<td>' + order.payment + '</td>' +
                    '<td><button class="btn btn-small" onclick="validateOrder(' + order.id + ')">Valider la vente</button></td>';
                pendingList.appendChild(tr);
            });
        }

        if (completedOrders.length === 0) {
            salesHistoryList.innerHTML = '<tr><td colspan="6" class="text-center">Aucune vente enregistrée dans l\'historique.</td></tr>';
        } else {
            completedOrders.forEach(order => {
                const itemsSummary = order.items.map(i => i.qty + 'x ' + i.name).join('<br>');
                const orderRef = order.orderNumber || '';
                const tr = document.createElement('tr');
                tr.innerHTML = 
                    '<td><strong>' + orderRef + '</strong><br><small>' + order.date + '</small></td>' +
                    '<td><strong>' + order.clientName + '</strong><br><small>' + order.clientPhone + '</small></td>' +
                    '<td>' + itemsSummary + '</td>' +
                    '<td><strong>' + order.total.toLocaleString() + ' FCFA</strong></td>' +
                    '<td>' + order.payment + '</td>' +
                    '<td><span class="status-badge valide">' + order.status + '</span></td>';
                salesHistoryList.appendChild(tr);
            });
        }
    }
}

function editProduct(prodId) {
    const prod = products.find(p => p.id === prodId);
    if (!prod) return;

    document.getElementById('edit-product-id').value = prod.id;
    document.getElementById('prod-type').value = prod.type || 'detail';
    document.getElementById('prod-name').value = prod.name;
    document.getElementById('prod-category').value = prod.category;
    document.getElementById('prod-price').value = prod.price;
    document.getElementById('prod-desc').value = prod.desc;

    document.getElementById('form-title').textContent = 'Modifier : ' + prod.name;
    document.getElementById('submit-prod-btn').textContent = 'Enregistrer les modifications';
    document.getElementById('cancel-edit-btn').style.display = 'inline-block';
    document.getElementById('add-product-form').scrollIntoView({ behavior: 'smooth' });
}

function cancelEdit() {
    document.getElementById('add-product-form').reset();
    document.getElementById('edit-product-id').value = '';
    document.getElementById('form-title').textContent = 'Ajouter une volaille ou un lot';
    document.getElementById('submit-prod-btn').textContent = 'Ajouter au catalogue';
    document.getElementById('cancel-edit-btn').style.display = 'none';
}

const addProductForm = document.getElementById('add-product-form');
if (addProductForm) {
    addProductForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const editId = document.getElementById('edit-product-id').value;
        const fileInput = document.getElementById('prod-img-file');
        const file = fileInput.files[0];

        const saveProductData = function(imageData) {
            if (editId) {
                const index = products.findIndex(p => p.id == editId);
                if (index !== -1) {
                    products[index].type = document.getElementById('prod-type').value;
                    products[index].name = document.getElementById('prod-name').value;
                    products[index].category = document.getElementById('prod-category').value;
                    products[index].price = parseInt(document.getElementById('prod-price').value);
                    products[index].desc = document.getElementById('prod-desc').value;
                    if (imageData) {
                        products[index].img = imageData;
                    }
                }
                alert("Produit et photo modifiés avec succès !");
            } else {
                const newProd = {
                    id: Date.now(),
                    type: document.getElementById('prod-type').value,
                    name: document.getElementById('prod-name').value,
                    category: document.getElementById('prod-category').value,
                    price: parseInt(document.getElementById('prod-price').value),
                    img: imageData || 'image/pouletde chair.jpg',
                    desc: document.getElementById('prod-desc').value
                };
                products.push(newProd);
                alert("Nouveau produit ajouté au catalogue !");
            }

            try {
                saveData();
                renderAdmin();
                cancelEdit();
            } catch (err) {
                alert("Erreur de mémoire : la photo est encore trop lourde.");
            }
        };

        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const maxWidth = 500;
                    const scale = maxWidth / img.width;
                    canvas.width = maxWidth;
                    canvas.height = img.height * scale;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                    saveProductData(compressedBase64);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            saveProductData(null);
        }
    });
}

function deleteProduct(index) {
    if (confirm("Voulez-vous vraiment supprimer ce produit du catalogue ?")) {
        products.splice(index, 1);
        saveData();
        renderAdmin();
    }
}

function validateOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = 'Livrée / Récupérée';
        saveData();
        renderAdmin();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    saveData();
    const mainContainer = document.querySelector('main.container');
    if (mainContainer && mainContainer.dataset.pageType) {
        renderCatalog('Tout', mainContainer.dataset.pageType);
    }
    renderCart();
    renderClientHistory();
    renderAdmin();
});
// --- SÉCURITÉ ESPACE GÉRANT ---
if (window.location.pathname.includes('gerant.html')) {
    const codeSecret = "300106"; // Tu peux changer ce code secret ici avant le déploiement
    if (sessionStorage.getItem('gerant_connecte') !== 'oui') {
        const saisie = prompt("Accès réservé au vendeur. Entrez le code PIN Gérant :");
        if (saisie === codeSecret) {
            sessionStorage.setItem('gerant_connecte', 'oui');
        } else {
            alert("Code incorrect. Redirection vers la boutique.");
            window.location.href = "index.html";
        }
    }
}
