https://businessinsider.com.pl/gospodarka/gastro-pod-sciana-to-powrot-do-lat-90/dnh1r1s

New migration

```
npx mongo-migrate new hash
```

Invalid `prisma_1.prisma.articles.create()` invocation in
/opt/app/src/models/Article.js:44:45

41 components: data.components,
42 state: 'new',
43 };
→ 44 return prisma_1.prisma.articles.create({
data: {
user_id: '63ef6b6ef8320a8ddf29a132',
request_id: '642451a1899b5605bea7c438',
components: [
{
text: 'Francuski koncern: Rosja intensyfikuje cyberataki na sojuszników Ukrainy. Celem m.in. Polska',
xpath: [
'h1'
],
versions: [],

  ~~~~~~~~
  finish_reason: ''
},
           {
           text: 'Po niepowodzeniu cybernetycznej wojny przeciwko Ukrainie, Rosja intensyfikuje ataki na jej sojuszników — napisał w raporcie zamieszczonym na swojej stronie internetowej francuski koncern technologiczny Thales.',
           xpath: [
'p'
],
versions: [],
~~~~~~~~
finish_reason: ''
           },
         {
         text: 'Rosyjscy hakerzy celują w Polskę, kraje skandynawskie i bałtyckie poprzez wzniecanie sporów i rozpowszechnianie wiadomości próbujących podważyć sam fakt rosyjskiej inwazji na Ukrainę — czytamy w raporcie.',
         xpath: [
           'p'
           ],
           versions: [],
           ~~~~~~~~
           finish_reason: ''
         },
       {
       text: 'Na początku konfliktu większość cyberataków dotyczyła tylko Ukrainy (50,4 proc. w pierwszym kwartale 2022 r. w porównaniu z 28,6 proc. w trzecim), ale kraje UE odnotowały gwałtowny wzrost incydentów związanych z wojną w Ukrainie w ciągu ostatnich sześciu miesięcy — wzrost z 9,8 proc. do 46,5 proc. wszystkich rosyjskich cyberataków na świecie.',
       xpath: [
         'p'
         ],
         versions: [],
         ~~~~~~~~
         finish_reason: ''
       },
     {
     text: 'Oprócz dezinformacji prorosyjscy hakerzy stosują ataki na serwery i inną infrastrukturę informatyczną, by zakłócić działanie różnych instytucji. Stanowi to część rosyjskiej strategii polegającej na prowadzeniu wojny informacyjnej oraz paraliżowaniu firm publicznych i prywatnych — napisał Thales.',
     xpath: [
       'p'
       ],
       versions: [],
       ~~~~~~~~
       finish_reason: ''
     },
   {
   text: 'Na początku marca koncern Microsoft poinformował, że w pierwszych sześciu tygodniach bieżącego roku Rosja zainicjowała cyberataki w co najmniej 17 krajach europejskich i były one wymierzone głównie w instytucje rządowe w celach szpiegowskich — czytamy w raporcie.',
   xpath: [
     'p'
     ],
     versions: [],
     ~~~~~~~~
     finish_reason: ''
   }
            ],
        state: 'new',
    hash: 'ef4b0d7ad0bf3130f431da9bdc8a19a1b533e3ff',
versions: {
           hash: 'ef4b0d7ad0bf3130f431da9bdc8a19a1b533e3ff',
         up: [
         {
           op: 'replace',
path: '',
  value: {
      user_id: '63ef6b6ef8320a8ddf29a132',
          request_id: '642451a1899b5605bea7c438',
 components: [
       {
  text: 'Francuski koncern: Rosja intensyfikuje cyberataki na sojuszników Ukrainy. Celem m.in. Polska',
          xpath: [
       'h1'
  ],
          versions: [],
     finish_reason: ''
           },
    {
            text: 'Po niepowodzeniu cybernetycznej wojny przeciwko Ukrainie, Rosja intensyfikuje ataki na jej sojuszników — napisał w raporcie zamieszczonym na swojej stronie internetowej francuski koncern technologiczny Thales.',
       xpath: [
    'p'
            ],
       versions: [],
  finish_reason: ''
        },
 {
         text: 'Rosyjscy hakerzy celują w Polskę, kraje skandynawskie i bałtyckie poprzez wzniecanie sporów i rozpowszechnianie wiadomości próbujących podważyć sam fakt rosyjskiej inwazji na Ukrainę — czytamy w raporcie.',
    xpath: [
 'p'
         ],
    versions: [],
            finish_reason: ''
     },
           {
      text: 'Na początku konfliktu większość cyberataków dotyczyła tylko Ukrainy (50,4 proc. w pierwszym kwartale 2022 r. w porównaniu z 28,6 proc. w trzecim), ale kraje UE odnotowały gwałtowny wzrost incydentów związanych z wojną w Ukrainie w ciągu ostatnich sześciu miesięcy — wzrost z 9,8 proc. do 46,5 proc. wszystkich rosyjskich cyberataków na świecie.',
 xpath: [
           'p'
      ],
 versions: [],
         finish_reason: ''
  },
        {
   text: 'Oprócz dezinformacji prorosyjscy hakerzy stosują ataki na serwery i inną infrastrukturę informatyczną, by zakłócić działanie różnych instytucji. Stanowi to część rosyjskiej strategii polegającej na prowadzeniu wojny informacyjnej oraz paraliżowaniu firm publicznych i prywatnych — napisał Thales.',
           xpath: [
        'p'
   ],
           versions: [],
      finish_reason: ''
            },
     {
text: 'Na początku marca koncern Microsoft poinformował, że w pierwszych sześciu tygodniach bieżącego roku Rosja zainicjowała cyberataki w co najmniej 17 krajach europejskich i były one wymierzone głównie w instytucje rządowe w celach szpiegowskich — czytamy w raporcie.',
        xpath: [
     'p'
],
        versions: [],
   finish_reason: ''
         }
],
    state: 'new'
      }
      }
    ],
  down: [
  {
    op: 'replace',
      path: '',
        value: undefined
        }
      ]
  }
         }
 })
 
 Unknown arg `versions` in data.components.0.versions for type ComponentCreateInput. Did you mean `text`? Available args:
 type ComponentCreateInput {
   xpath?: ComponentCreatexpathInput | List<String>
     text: String
       finish_reason?: String
       }
       Unknown arg `versions` in data.components.1.versions for type ComponentCreateInput. Did you mean `text`? Available args:
       type ComponentCreateInput {
         xpath?: ComponentCreatexpathInput | List<String>
           text: String
finish_reason?: String
}
Unknown arg `versions` in data.components.2.versions for type ComponentCreateInput. Did you mean `text`? Available args:
type ComponentCreateInput {
  xpath?: ComponentCreatexpathInput | List<String>
    text: String
      finish_reason?: String
      }
      Unknown arg `versions` in data.components.3.versions for type ComponentCreateInput. Did you mean `text`? Available args:
      type ComponentCreateInput {
        xpath?: ComponentCreatexpathInput | List<String>
          text: String
            finish_reason?: String
            }
            Unknown arg `versions` in data.components.4.versions for type ComponentCreateInput. Did you mean `text`? Available args:
            type ComponentCreateInput {
 xpath?: ComponentCreatexpathInput | List<String>
   text: String
     finish_reason?: String
     }
     Unknown arg `versions` in data.components.5.versions for type ComponentCreateInput. Did you mean `text`? Available args:
     type ComponentCreateInput {
       xpath?: ComponentCreatexpathInput | List<String>
         text: String
           finish_reason?: String
           }
           
