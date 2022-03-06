document.addEventListener("DOMContentLoaded", function() {
    document.querySelector('.add-record-input').addEventListener('focus', disableDeleteButton);
    document.querySelector('.add-record-input').addEventListener('blur', enableDeleteButton);
});

function disableDeleteButton() {
    document.querySelector('.delete-button').classList.add('disabled-button');
}

function enableDeleteButton() {
    document.querySelector('.delete-button').classList.remove('disabled-button');
}