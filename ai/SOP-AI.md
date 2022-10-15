# SOP Development Track AI

## Pre-requisites

```
- Python 3.9
- git
```

## Getting started

```
git clone https://github.com/Drithh/e-commerce-website.git
cd e-commerce-website
pip install pre-commit
pre-commit install
```

## Development

1. Pastikan sudah berada di branch `ai` dengan cara `git checkout ai`
2. Pastikan sudah melakukan `git pull` terlebih dahulu untuk menghindari konflik
3. Di branch `ai` ini, kamu bebas untuk melakukan perubahan pada folder `ai`
4. Silahkan membuat branch baru dari base branch `ai`, tetapi pastikan nama branch kamu sudah jelas dan deskriptif
5. Penggunaan bahasa inggris dalam penamaan fungsi, variabel, dan komentar sangat dianjurkan
6. Penamaan variabel dan fungsi harus jelas, deskriptif, dan menggunakan style snake_case
7. Pull request hanya boleh dilakukan ke branch `ai` saja
8. Seblum melakukan commit, pastikan sudah melakukan `make pre-commit` untuk memastikan tidak ada error

## Notes

1. Jika menggunakan environment variable, pastikan sudah ditambahkan di file `.env.example` dan beritahu ke yang lain
