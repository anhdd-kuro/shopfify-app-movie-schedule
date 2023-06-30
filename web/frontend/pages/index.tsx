import {
  Card,
  Page,
  Layout,
  Image,
  VerticalStack,
  Link,
  Text,
} from '@shopify/polaris'

import { trophyImage } from '../assets'

import { ProductsCard } from '../components'

export default function HomePage() {
  return (
    <Page narrowWidth>
      <Layout>
        <Layout.Section>
          <Card>
            <VerticalStack gap="10" inlineAlign="center">
              <VerticalStack>
                <VerticalStack gap="5">
                  <Text variant="headingMd" as="h2">
                    Nice work on building a Shopify app 🎉
                  </Text>
                  <p>
                    Your app is ready to explore! It contains everything you
                    need to get started including the{' '}
                    <Link url="https://polaris.shopify.com/" target="_blank">
                      Polaris design system
                    </Link>
                    ,{' '}
                    <Link
                      url="https://shopify.dev/api/admin-graphql"
                      target="_blank"
                    >
                      Shopify Admin API
                    </Link>
                    , and{' '}
                    <Link
                      url="https://shopify.dev/apps/tools/app-bridge"
                      target="_blank"
                    >
                      App Bridge
                    </Link>{' '}
                    UI library and components.
                  </p>
                  <p>
                    Ready to go? Start populating your app with some sample
                    products to view and test in your store.{' '}
                  </p>
                  <p>
                    Learn more about building out your app in{' '}
                    <Link
                      url="https://shopify.dev/apps/getting-started/add-functionality"
                      target="_blank"
                    >
                      this Shopify tutorial
                    </Link>{' '}
                    📚{' '}
                  </p>
                </VerticalStack>
              </VerticalStack>
              <VerticalStack>
                <div style={{ padding: '0 20px' }}>
                  <Image
                    source={trophyImage}
                    alt="Nice work on building a Shopify app"
                    width={120}
                  />
                </div>
              </VerticalStack>
            </VerticalStack>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <ProductsCard />
        </Layout.Section>
      </Layout>
    </Page>
  )
}
