import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, Film, Tv, Play, ExternalLink, Clock, Users } from 'lucide-react';
import { useGetAnimeByIdQuery, useGetAnimeCharactersQuery, useGetAnimeStaffQuery, useGetAnimeRelationsQuery, useGetAnimeRecommendationsQuery, useGetAnimeStatisticsQuery } from '@/features/jikan/jikanApi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { AnimeGrid } from '@/components/AnimeGrid';

const AnimeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetAnimeByIdQuery(Number(id));
  const { data: chars } = useGetAnimeCharactersQuery(Number(id));
  const { data: staff } = useGetAnimeStaffQuery(Number(id));
  const { data: relations } = useGetAnimeRelationsQuery(Number(id));
  const { data: recs } = useGetAnimeRecommendationsQuery(Number(id));
  const { data: stats } = useGetAnimeStatisticsQuery(Number(id));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-32" />
        <div className="grid md:grid-cols-[300px,1fr] gap-6">
          <Skeleton className="w-full aspect-[3/4]" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Anime Not Found</h2>
        <Button onClick={() => navigate('/search')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Search
        </Button>
      </div>
    );
  }

  const anime = data.data;
  const imageUrl = anime.images.webp.large_image_url || anime.images.jpg.large_image_url;

  return (
    <div className="space-y-6 animate-fade-in">
      <Button
        variant="ghost"
        onClick={() => navigate('/search')}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Search
      </Button>

      <div className="grid md:grid-cols-[300px,1fr] lg:grid-cols-[350px,1fr] gap-6 lg:gap-8">
        <div className="space-y-4">
          <Card className="overflow-hidden border-border">
            <img
              src={imageUrl}
              alt={anime.title}
              className="w-full aspect-[3/4] object-cover"
            />
          </Card>
          
          {anime.trailer && (anime.trailer.url || anime.trailer.youtube_id) && (
            <Button
              variant="default"
              className="w-full gap-2"
              onClick={() => {
                const trailerUrl = anime.trailer.url || (anime.trailer.youtube_id ? `https://www.youtube.com/watch?v=${anime.trailer.youtube_id}` : '');
                if (trailerUrl) {
                  window.open(trailerUrl, '_blank');
                }
              }}
            >
              <Play className="h-4 w-4" />
              Watch Trailer
            </Button>
          )}
          
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => window.open(anime.url, '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
            View on MyAnimeList
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{anime.title}</h1>
            {anime.title_english && anime.title_english !== anime.title && (
              <p className="text-lg text-muted-foreground mb-2">{anime.title_english}</p>
            )}
            {anime.title_japanese && (
              <p className="text-sm text-muted-foreground">{anime.title_japanese}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            {anime.score && (
              <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg border border-border">
                <Star className="h-5 w-5 fill-primary text-primary" />
                <span className="font-bold text-lg">{anime.score.toFixed(2)}</span>
                <span className="text-sm text-muted-foreground">
                  ({anime.scored_by?.toLocaleString()} users)
                </span>
              </div>
            )}
            {anime.rank && (
              <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg border border-border">
                <span className="text-sm text-muted-foreground">Rank</span>
                <span className="font-bold text-primary">#{anime.rank}</span>
              </div>
            )}
            {anime.popularity && (
              <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg border border-border">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">#{anime.popularity}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {anime.type && (
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Tv className="h-4 w-4" />
                  Type
                </div>
                <div className="font-medium">{anime.type}</div>
              </div>
            )}
            {anime.episodes && (
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Film className="h-4 w-4" />
                  Episodes
                </div>
                <div className="font-medium">{anime.episodes}</div>
              </div>
            )}
            {anime.status && (
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="font-medium">{anime.status}</div>
              </div>
            )}
            {anime.aired?.string && (
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Aired
                </div>
                <div className="font-medium text-sm">{anime.aired.string}</div>
              </div>
            )}
            {anime.duration && (
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Duration
                </div>
                <div className="font-medium text-sm">{anime.duration}</div>
              </div>
            )}
            {anime.source && (
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Source</div>
                <div className="font-medium">{anime.source}</div>
              </div>
            )}
          </div>

          {anime.studios && anime.studios.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Studios</h3>
              <div className="flex flex-wrap gap-2">
                {anime.studios.map((studio) => (
                  <Badge key={studio.mal_id} variant="secondary">
                    {studio.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {anime.genres && anime.genres.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {anime.genres.map((genre) => (
                  <Badge key={genre.mal_id} variant="outline">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {anime.synopsis && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Synopsis</h3>
              <p className="text-muted-foreground leading-relaxed">{anime.synopsis}</p>
            </div>
          )}

          {anime.background && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Background</h3>
              <p className="text-muted-foreground leading-relaxed">{anime.background}</p>
            </div>
          )}
        </div>
      </div>

      {/* Relations */}
      {relations?.data?.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Relations</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relations.data.slice(0, 6).map((rel: any, idx: number) => (
              <Card key={idx} className="p-4 border-border">
                <div className="text-xs text-muted-foreground mb-1">{rel.relation}</div>
                <div className="space-y-2">
                  {rel.entry?.slice(0, 2).map((e: any) => (
                    <Link key={e.mal_id} to={`/anime/${e.mal_id}`} className="block hover:underline">
                      {e.name}
                    </Link>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Characters */}
      {chars?.data?.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Characters</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chars.data.slice(0, 9).map((c: any) => (
              <Card key={c.character.mal_id} className="flex items-center gap-3 p-3 border-border">
                <img
                  src={c.character.images?.jpg?.image_url}
                  alt={c.character.name}
                  className="h-16 w-12 object-cover rounded"
                />
                <div className="min-w-0">
                  <div className="font-medium truncate">{c.character.name}</div>
                  <div className="text-xs text-muted-foreground">{c.role}</div>
                  {c.voice_actors?.[0]?.person?.name && (
                    <div className="text-xs mt-1">
                      VA: <span className="text-muted-foreground">{c.voice_actors[0].person.name}</span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Staff */}
      {staff?.data?.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Staff</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {staff.data.slice(0, 9).map((s: any) => (
              <Card key={s.person.mal_id} className="flex items-center gap-3 p-3 border-border">
                <img
                  src={s.person.images?.jpg?.image_url}
                  alt={s.person.name}
                  className="h-16 w-16 rounded object-cover"
                />
                <div className="min-w-0">
                  <div className="font-medium truncate">{s.person.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{s.positions?.join(', ')}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Statistics */}
      {stats?.data && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Score Distribution</h3>
          <div className="grid grid-cols-10 gap-2 items-end">
            {Object.entries(stats.data.scores || {})
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([score, obj]: any) => (
                <div key={score} className="flex flex-col items-center gap-1">
                  <div
                    className="w-6 bg-primary/80 rounded"
                    style={{ height: `${Math.max(4, obj.percentage)}px` }}
                    title={`${obj.votes} votes`}
                  />
                  <span className="text-xs text-muted-foreground">{score}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recs?.data?.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Recommendations</h3>
          <AnimeGrid
            anime={recs.data.slice(0, 12).map((r: any) => ({
              ...r.entry,
              mal_id: r.entry.mal_id,
              images: { jpg: { image_url: r.entry.images?.jpg?.image_url, large_image_url: r.entry.images?.jpg?.image_url }, webp: { image_url: r.entry.images?.webp?.image_url, large_image_url: r.entry.images?.webp?.image_url } },
              trailer: { youtube_id: null, url: null, embed_url: null },
              title: r.entry.title,
              type: null,
              source: null,
              episodes: null,
              status: null,
              airing: false,
              aired: { from: null, to: null, string: '' },
              duration: null,
              rating: null,
              score: null,
              scored_by: null,
              rank: null,
              popularity: null,
              members: null,
              favorites: null,
              synopsis: null,
              background: null,
              season: null,
              year: null,
              studios: [],
              genres: [],
              demographics: [],
            })) as any}
          />
        </div>
      )}
    </div>
  );
};

export default AnimeDetailPage;
