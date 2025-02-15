

const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

// abrir o modal do carrinho
cartBtn.addEventListener("click", function() {
    cartModal.style.display = "flex";
    updateCartModal();
});

// fechar o modal quando clicar fora
cartModal.addEventListener("click", function(e) {
    if (e.target === cartModal) {
        cartModal.style.display = "none";
    }
});

// ao clicar no botao fechar
closeModalBtn.addEventListener("click", function() {
    cartModal.style.display = "none";
});

// quando clicar no item do carrinho
menu.addEventListener("click", function(e) {
    let parentButton = e.target.closest(".add-to-cart-btn");

    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
        // add no carrinho
        addToCart(name, price);
    }
});

// função para add no carrinho
function addToCart(name, price) {
    // verifica se vc ja add o mesmo item
    const existingItem = cart.find(item => item.name === name);
    // aumentando a quantidade dos itens
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        });
    }
    updateCartModal();
}

// mostrar na tela o item adicionado
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "flex-col");

        cartItemElement.innerHTML = `
        <div class="flex item-center justify-between">
          <div>
          <p class="font-medium">${item.name}</p>
          <p>${item.quantity}</p>
          <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
          </div>
           <button class="remove-btn" data-name="${item.name}">
           Remover
           </button>
        </div>
        `;

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

cartItemsContainer.addEventListener("click", function(e) {
    if (e.target.classList.contains("remove-btn")) {
        const name = e.target.getAttribute("data-name");
        removeItemCard(name);
    }
});

function removeItemCard(name) {
    const index = cart.findIndex(item => item.name === name);
    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }
        // splice remove o item da lista
        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener("input", function(e) {
    let inputValue = e.target.value;

    if (inputValue !== "") {
        addressInput.classList.remove("border-red-600");
        addressWarn.classList.add("hidden");
    }
});

checkoutBtn.addEventListener("click", function() {
    const isOpen = checkRestauranteOpen();
    if (!isOpen) {
        Toastify({
            text: "Desculpe, O Restaurante está Fechado",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "red",
            },
        }).showToast();
        return;
    }

    if (cart.length === 0) return;
    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-600");
        return;
    }

    // ENVIAR O PEDIDO PARA O API ZAP
    const cartItem = cart.map(item => {
        return (
            `*${item.name}* \nQuantidade: (${item.quantity}) \nPreço: R$${item.price} \n${total.total} \n `
        );
    }).join("");

    const message = encodeURIComponent(cartItem);
    const phone = "5581998366024";

    window.open(`https://wa.me/${phone}?text=${message} \n Endereço: ${addressInput.value}`, "_blank");

    cart = [];
    updateCartModal();
});

// verificação de funcionamento do estabelecimento
function checkRestauranteOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
    // true = restaurante está aberto
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestauranteOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-600");
    spanItem.classList.add("bg-green-400");
} else {
    spanItem.classList.remove("bg-green-400");
    spanItem.classList.add("bg-red-600");
}
