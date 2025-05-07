import { defineConfig, presetIcons, presetWind3 } from 'unocss'
import path from 'node:path'
import fs from 'node:fs'
import { colors } from './src/constant/theme'

const dirname = process.cwd()

function getIcon(name: string) {
    const p = path.resolve(dirname, 'src/assets/icons', `${name}.svg`)
    return fs.readFileSync(p, 'utf-8')
}


export default defineConfig({
    content: {
        filesystem: [
            './src/**/*.{ts,tsx,js,jsx}',
        ]
    },
    presets: [
        presetWind3(),
        presetIcons({
            collections: {
                icons: iconName => getIcon(iconName),
            },
        }),
    ],
    theme: {
        colors: colors
    },
})