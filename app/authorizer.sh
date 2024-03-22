#!/bin/bash

# Vérification du nombre d'arguments
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <clé_publique_ssh>"
    exit 1
fi

# Chemin vers le répertoire de l'utilisateur root
root_ssh_dir="/root/.ssh"

# Vérification de l'existence du répertoire .ssh dans le répertoire de l'utilisateur root
if [ ! -d "$root_ssh_dir" ]; then
    mkdir -p "$root_ssh_dir"
fi

# Chemin complet du fichier authorized_keys
authorized_keys_file="$root_ssh_dir/authorized_keys"

# Vérification de l'existence du fichier authorized_keys
if [ ! -f "$authorized_keys_file" ]; then
    touch "$authorized_keys_file"
fi

# Ajout de la clé publique au fichier authorized_keys
echo "$1" >> "$authorized_keys_file"

# Message de confirmation
echo "Clé publique ajoutée avec succès au fichier $authorized_keys_file"
