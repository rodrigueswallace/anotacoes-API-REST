import * as React from "react"
import { FormInput } from "@/components/ui/form-input"
import { FormLabel } from "@/components/ui/form-label"
import { FormSelect, FormSelectContent, FormSelectItem, FormSelectTrigger, FormSelectValue } from "@/components/ui/form-select"
import { FormMultiSelect, FormMultiSelectContent, FormMultiSelectItem, FormMultiSelectTrigger } from "@/components/ui/form-multi-select"
import { FormSearchableSelect } from "@/components/ui/form-searchable-select"
import { FormSearchableMultiSelect, FormSearchableMultiSelectContent, FormSearchableMultiSelectItem, FormSearchableMultiSelectTrigger, FormSearchableMultiSelectEmpty } from "@/components/ui/form-searchable-multi-select"
import { FormDatePicker } from "@/components/ui/form-datepicker"
import { FormTextarea } from "@/components/ui/form-textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function FormDemo() {
  const [selectedDate, setSelectedDate] = React.useState<Date>()
  const [inputState, setInputState] = React.useState("")
  const [selectValue, setSelectValue] = React.useState("")
  const [categoryValue, setCategoryValue] = React.useState("categoria1")
  const [multiSelectValues, setMultiSelectValues] = React.useState<string[]>([])
  const [multiSelectValues2, setMultiSelectValues2] = React.useState<string[]>(["tag1", "tag3"])
  const [searchableSelectValue, setSearchableSelectValue] = React.useState("")
  const [searchableMultiSelectValues, setSearchableMultiSelectValues] = React.useState<string[]>([])

  const handleMultiSelectChange = (value: string) => {
    setMultiSelectValues(prev => 
      prev.includes(value) 
        ? prev.filter(v => v !== value)
        : [...prev, value]
    )
  }

  const handleMultiSelectChange2 = (value: string) => {
    setMultiSelectValues2(prev => 
      prev.includes(value) 
        ? prev.filter(v => v !== value)
        : [...prev, value]
    )
  }

  const removeMultiSelectValue = (value: string) => {
    setMultiSelectValues(prev => prev.filter(v => v !== value))
  }

  const removeMultiSelectValue2 = (value: string) => {
    setMultiSelectValues2(prev => prev.filter(v => v !== value))
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-sora text-xl text-main-black">
            Componentes de Formulário
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Input de Texto - Estados */}
          <div className="space-y-4">
            <h3 className="font-sora text-lg text-main-black">Caixas de Texto</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <FormLabel>Estado Natural</FormLabel>
                <FormInput 
                  placeholder="Digite aqui"
                  value={inputState}
                  onChange={(e) => setInputState(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <FormLabel required>Estado Selecionado</FormLabel>
                <FormInput 
                  placeholder="Digite aqui"
                  isSelected={true}
                  value="Texto selecionado"
                />
              </div>
              
              <div className="space-y-2">
                <FormLabel>Estado Desativado</FormLabel>
                <FormInput 
                  placeholder="Desativado"
                  disabled={true}
                />
              </div>
            </div>
          </div>

          {/* Textarea */}
          <div className="space-y-4">
            <h3 className="font-sora text-lg text-main-black">Área de Texto</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormLabel required>Descrição</FormLabel>
                <FormTextarea 
                  placeholder="Digite uma descrição detalhada..."
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <FormLabel>Observações</FormLabel>
                <FormTextarea 
                  placeholder="Observações adicionais"
                  isSelected={true}
                  rows={4}
                  value="Texto já preenchido e selecionado"
                />
              </div>
            </div>
          </div>

          {/* Select */}
          <div className="space-y-4">
            <h3 className="font-sora text-lg text-main-black">Caixas de Seleção</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormLabel required>Status</FormLabel>
                <FormSelect value={selectValue} onValueChange={setSelectValue}>
                  <FormSelectTrigger hasValue={!!selectValue} onClear={() => setSelectValue("")}>
                    <FormSelectValue placeholder="Chamados abertos" />
                  </FormSelectTrigger>
                  <FormSelectContent>
                    <FormSelectItem value="option1">Opção 1</FormSelectItem>
                    <FormSelectItem value="option2">Opção 2</FormSelectItem>
                    <FormSelectItem value="option3">Opção 3</FormSelectItem>
                    <FormSelectItem value="option4">Opção 4</FormSelectItem>
                  </FormSelectContent>
                </FormSelect>
              </div>
              
              <div className="space-y-2">
                <FormLabel>Categoria</FormLabel>
                <FormSelect value={categoryValue} onValueChange={setCategoryValue} disabled>
                  <FormSelectTrigger hasValue={!!categoryValue} onClear={() => setCategoryValue("")}>
                    <FormSelectValue placeholder="Selecione uma categoria" />
                  </FormSelectTrigger>
                  <FormSelectContent>
                    <FormSelectItem value="categoria1">Categoria 1</FormSelectItem>
                    <FormSelectItem value="categoria2">Categoria 2</FormSelectItem>
                    <FormSelectItem value="categoria3">Categoria 3</FormSelectItem>
                  </FormSelectContent>
                </FormSelect>
              </div>
            </div>
          </div>

          {/* Multi Select */}
          <div className="space-y-4">
            <h3 className="font-sora text-lg text-main-black">Seleção Múltipla</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormLabel required>Tags</FormLabel>
            <FormMultiSelect value={multiSelectValues} onValueChange={setMultiSelectValues}>
              <FormMultiSelectTrigger 
                placeholder="Selecione tags..."
              />
              <FormMultiSelectContent>
                <FormMultiSelectItem value="tag1">
                  Tag 1
                </FormMultiSelectItem>
                <FormMultiSelectItem value="tag2">
                  Tag 2
                </FormMultiSelectItem>
                <FormMultiSelectItem value="tag3">
                  Tag 3
                </FormMultiSelectItem>
                <FormMultiSelectItem value="tag4">
                  Tag 4
                </FormMultiSelectItem>
                <FormMultiSelectItem value="tag5">
                  Tag 5
                </FormMultiSelectItem>
              </FormMultiSelectContent>
            </FormMultiSelect>
              </div>
              
              <div className="space-y-2">
                <FormLabel>Habilidades (Pré-selecionado)</FormLabel>
                <FormMultiSelect value={multiSelectValues2} onValueChange={setMultiSelectValues2}>
                  <FormMultiSelectTrigger 
                    placeholder="Selecione habilidades..."
                  />
                  <FormMultiSelectContent>
                    <FormMultiSelectItem value="tag1">
                      React
                    </FormMultiSelectItem>
                    <FormMultiSelectItem value="tag2">
                      TypeScript
                    </FormMultiSelectItem>
                    <FormMultiSelectItem value="tag3">
                      Node.js
                    </FormMultiSelectItem>
                    <FormMultiSelectItem value="tag4">
                      Python
                    </FormMultiSelectItem>
                    <FormMultiSelectItem value="tag5">
                      SQL
                    </FormMultiSelectItem>
                  </FormMultiSelectContent>
                </FormMultiSelect>
              </div>
            </div>
          </div>

          {/* Searchable Select */}
          <div className="space-y-4">
            <h3 className="font-sora text-lg text-main-black">Seleção com Pesquisa</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormLabel required>Países</FormLabel>
                <FormSearchableSelect 
                  value={searchableSelectValue} 
                  onValueChange={setSearchableSelectValue}
                  placeholder="Selecione um país..."
                  clearable
                  options={[
                    { value: "br", label: "Brasil" },
                    { value: "us", label: "Estados Unidos" },
                    { value: "ca", label: "Canadá" },
                    { value: "uk", label: "Reino Unido" },
                    { value: "fr", label: "França" },
                    { value: "de", label: "Alemanha" },
                    { value: "jp", label: "Japão" },
                    { value: "au", label: "Austrália" }
                  ]}
                />
              </div>
              
              <div className="space-y-2">
                <FormLabel>Tecnologias</FormLabel>
                <FormSearchableMultiSelect value={searchableMultiSelectValues} onValueChange={setSearchableMultiSelectValues}>
                  <FormSearchableMultiSelectTrigger 
                    placeholder="Pesquisar tecnologias..."
                  />
                  <FormSearchableMultiSelectContent>
                    <FormSearchableMultiSelectItem value="react">React</FormSearchableMultiSelectItem>
                    <FormSearchableMultiSelectItem value="vue">Vue.js</FormSearchableMultiSelectItem>
                    <FormSearchableMultiSelectItem value="angular">Angular</FormSearchableMultiSelectItem>
                    <FormSearchableMultiSelectItem value="svelte">Svelte</FormSearchableMultiSelectItem>
                    <FormSearchableMultiSelectItem value="typescript">TypeScript</FormSearchableMultiSelectItem>
                    <FormSearchableMultiSelectItem value="javascript">JavaScript</FormSearchableMultiSelectItem>
                    <FormSearchableMultiSelectItem value="python">Python</FormSearchableMultiSelectItem>
                    <FormSearchableMultiSelectItem value="nodejs">Node.js</FormSearchableMultiSelectItem>
                    <FormSearchableMultiSelectItem value="nextjs">Next.js</FormSearchableMultiSelectItem>
                    <FormSearchableMultiSelectItem value="nuxtjs">Nuxt.js</FormSearchableMultiSelectItem>
                    <FormSearchableMultiSelectEmpty>
                      Nenhuma tecnologia encontrada.
                    </FormSearchableMultiSelectEmpty>
                  </FormSearchableMultiSelectContent>
                </FormSearchableMultiSelect>
              </div>
            </div>
          </div>

          {/* Date Picker */}
          <div className="space-y-4">
            <h3 className="font-sora text-lg text-main-black">Seletor de Data</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <FormLabel required>Data de Início</FormLabel>
                <FormDatePicker 
                  date={selectedDate}
                  onDateChange={setSelectedDate}
                  placeholder="Início"
                />
              </div>
              
              <div className="space-y-2">
                <FormLabel>Data de Fim</FormLabel>
                <FormDatePicker 
                  placeholder="Fim"
                />
              </div>
              
              <div className="space-y-2">
                <FormLabel>Data Desativada</FormLabel>
                <FormDatePicker 
                  placeholder="Desativado"
                  disabled={true}
                />
              </div>
            </div>
          </div>

          {/* Estados de Erro */}
          <div className="space-y-4">
            <h3 className="font-sora text-lg text-main-black">Estados de Erro</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormLabel required>Campo com Erro</FormLabel>
                <FormInput 
                  placeholder="Campo obrigatório"
                  error={true}
                  value=""
                />
                <span className="text-main-danger text-xs font-sora">Este campo é obrigatório</span>
              </div>
              
              <div className="space-y-2">
                <FormLabel required>Textarea com Erro</FormLabel>
                <FormTextarea 
                  placeholder="Descrição obrigatória"
                  error={true}
                  rows={3}
                />
                <span className="text-main-danger text-xs font-sora">Descrição é obrigatória</span>
              </div>
            </div>
          </div>
          
        </CardContent>
      </Card>
    </div>
  )
}