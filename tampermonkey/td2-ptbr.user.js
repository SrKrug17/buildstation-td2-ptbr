// ==UserScript==
// @name         The Division 2 PT-BR – Build Station
// @namespace    td2.ptbr.buildstation
// @version      1.0.0
// @description  Tradução completa PT-BR do Build Station TD2
// @match        https://buildstation.app/td2/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      raw.githubusercontent.com
// ==/UserScript==

(function () {
    'use strict';

    let ENABLED = true;

    GM_registerMenuCommand("🔁 Ativar/Desativar Tradução", () => {
        ENABLED = !ENABLED;
        alert("Tradução " + (ENABLED ? "ATIVADA" : "DESATIVADA"));
        location.reload();
    });

    const BASE_URL = "https://raw.githubusercontent.com/SrKrug17/td2-buildstation-ptbr/main/translations/";

    const FILES = [
        "ui.json",
        "weapons.json",
        "gear.json",
        "brands.json",
        "talents.json",
        "attributes.json",
        "status.json"
    ];

    let DICTIONARY = {};

    function loadJSON(file) {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "GET",
                url: BASE_URL + file,
                onload: res => resolve(JSON.parse(res.responseText))
            });
        });
    }

    async function loadAll() {
        for (const file of FILES) {
            try {
                const data = await loadJSON(file);
                Object.assign(DICTIONARY, data);
            } catch (e) {
                console.error("Erro ao carregar:", file);
            }
        }
        applyTranslation();
    }

    function applyTranslation() {
        if (!ENABLED) return;

        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let node;
        while (node = walker.nextNode()) {
            const original = node.nodeValue.trim();
            if (DICTIONARY[original]) {
                node.nodeValue = DICTIONARY[original];
            }
        }
    }

    new MutationObserver(applyTranslation)
        .observe(document.body, { childList: true, subtree: true });

    loadAll();
})();
