class RecintosZoo {

    constructor() {
        this.animais = [
            { especie: 'LEAO', tamanho: 3, biomas: ['savana'], carnivoro: true },
            { especie: 'LEOPARDO', tamanho: 2, biomas: ['savana'], carnivoro: true },
            { especie: 'CROCODILO', tamanho: 3, biomas: ['rio'], carnivoro: true },
            { especie: 'MACACO', tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
            { especie: 'GAZELA', tamanho: 2, biomas: ['savana'], carnivoro: false },
            { especie: 'HIPOPOTAMO', tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false }
        ];

        this.recintos = [
            { numero: 1, bioma: 'savana', tamanhoTotal: 10, animais: [{ especie: 'MACACO', quantidade: 3 }] },
            { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animais: [] },
            { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animais: [{ especie: 'GAZELA', quantidade: 1 }] },
            { numero: 4, bioma: 'rio', tamanhoTotal: 8, animais: [] },
            { numero: 5, bioma: 'savana', tamanhoTotal: 9, animais: [{ especie: 'LEAO', quantidade: 1 }] }
        ];
    }

    analisaRecintos(animal, quantidade) {
        const animalInfo = this.animais.find(a => a.especie === animal);
        if (!animalInfo) {
            return { erro: "Animal inválido" };
        }

        if (quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }

        const recintosViaveis = [];

        for (const recinto of this.recintos) {
            // VERIFICA BIOMA -> separando o caso do savana e rio pois é um bioma composto.
            const biomasRecinto = recinto.bioma.split(' e ');
            const biomasValidos = animalInfo.biomas.some(bioma => biomasRecinto.includes(bioma));
            if (!biomasValidos) {
                continue;
            }
            // Definindo o espaço ocupado
            let espacoOcupado = recinto.animais.reduce((total, a) => {
                const info = this.animais.find(an => an.especie === a.especie);
                return total + a.quantidade * info.tamanho;
            }, 0);

            // Verifica se o recinto já tem animais
            if (recinto.animais.length > 0) {
                if (animalInfo.carnivoro) {
                    // Se o animal atual é carnívoro, verifica se há espécies diferentes no recinto
                    if (recinto.animais.some(a => a.especie !== animal)) {
                        continue;
                    }
                } else {
                    // Se o animal atual não é carnívoro, verifica se há carnívoros no recinto
                    if (recinto.animais.some(a => {
                        const info = this.animais.find(an => an.especie === a.especie);
                        return info.carnivoro;
                    })) {
                        continue;
                    }
                }
            }

            // Verifica se o animal atual é um hipopótamo
            if (animal === 'HIPOPOTAMO') {
                // Se o recinto não é "savana e rio" e já contém animais que não são hipopótamos, continue
                if (recinto.bioma !== 'savana e rio' && recinto.animais.some(a => a.especie !== 'HIPOPOTAMO')) {
                    continue;
                }
            }
            
            // Verifica se o recinto está vazio e o animal é um macaco que não irá ficar sozinho.
            if (animal === 'MACACO' && recinto.animais.length === 0 && quantidade < 2) {
                continue;
            }

            let espacoAdicional = 0;
            if (recinto.animais.length > 0 && !animalInfo.carnivoro && recinto.animais.some(a => a.especie !== animal)) {
                espacoAdicional = 1;
            }

            const espacoNecessario = quantidade * animalInfo.tamanho + espacoAdicional;
            if (recinto.tamanhoTotal - espacoOcupado >= espacoNecessario) {
                recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${recinto.tamanhoTotal - espacoOcupado - espacoNecessario} total: ${recinto.tamanhoTotal})`);
            }
        }

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        return { recintosViaveis };
    }

}

export { RecintosZoo as RecintosZoo };