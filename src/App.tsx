import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Star,
  Calendar,
  Download,
  Settings,
  Heart,
  User,
  ArrowLeft,
  Moon,
  Sun,
  Home,
  ChevronDown,
  Upload,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { apiClient } from "~/client/api";
import { useToast, useAuth, encodeFileAsBase64DataURL } from "~/client/utils";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui";

// Types
type Game = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  developer: string;
  version: string;
  engine: string;
  language: string;
  rating: number;
  tags: string;
  downloadUrl?: string | null;
  downloadUrlWindows?: string | null;
  downloadUrlAndroid?: string | null;
  downloadUrlLinux?: string | null;
  downloadUrlMac?: string | null;
  censored: boolean;
  installation: string;
  changelog: string;
  devNotes?: string | null;
  releaseDate: string | Date;
  osWindows: boolean;
  osAndroid: boolean;
  osLinux: boolean;
  osMac: boolean;
  images?: Array<{ id: string; imageUrl: string }>;
  isFavorited?: boolean;
};

// Components
function GameCard({ game }: { game: Game }) {
  const tags = game.tags.split(",").map((tag: string) => tag.trim());

  return (
    <Link to={`/game/${game.id}`} className="block">
      <Card className="game-card overflow-hidden cursor-pointer">
        <div className="game-card-image">
          <img src={game.imageUrl} alt={game.title} loading="lazy" />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg line-clamp-2">{game.title}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary">{game.engine}</Badge>
            <span>{game.version}</span>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
            {game.description}
          </p>
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tag-badge">
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="tag-badge">+{tags.length - 3}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const getVisiblePages = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Anterior
      </Button>
      {getVisiblePages().map((page, index) => (
        <Button
          key={index}
          variant={page === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={page === "..."}
        >
          {page}
        </Button>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Próximo
      </Button>
    </div>
  );
}

function GameForm({
  game,
  onSubmit,
  onCancel,
}: {
  game?: Game;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: game?.title || "",
    description: game?.description || "",
    imageUrl: game?.imageUrl || "",
    developer: game?.developer || "",
    version: game?.version || "",
    engine: game?.engine || "",
    language: game?.language || "",
    rating: game?.rating || 4,
    tags: game?.tags || "",
    downloadUrl: game?.downloadUrl || "",
    downloadUrlWindows: game?.downloadUrlWindows || "",
    downloadUrlAndroid: game?.downloadUrlAndroid || "",
    downloadUrlLinux: game?.downloadUrlLinux || "",
    downloadUrlMac: game?.downloadUrlMac || "",
    censored: game?.censored || false,
    installation: game?.installation || "",
    changelog: game?.changelog || "",
    devNotes: game?.devNotes || "",
    osWindows: game?.osWindows ?? true,
    osAndroid: game?.osAndroid ?? false,
    osLinux: game?.osLinux ?? false,
    osMac: game?.osMac ?? false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="developer">Desenvolvedor</Label>
          <Input
            id="developer"
            value={formData.developer}
            onChange={(e) =>
              setFormData({ ...formData, developer: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="version">Versão</Label>
          <Input
            id="version"
            value={formData.version}
            onChange={(e) =>
              setFormData({ ...formData, version: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="engine">Engine</Label>
          <Input
            id="engine"
            value={formData.engine}
            onChange={(e) =>
              setFormData({ ...formData, engine: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="language">Idioma</Label>
          <Input
            id="language"
            value={formData.language}
            onChange={(e) =>
              setFormData({ ...formData, language: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rating">Avaliação</Label>
          <Input
            id="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={formData.rating}
            onChange={(e) =>
              setFormData({ ...formData, rating: parseFloat(e.target.value) })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) =>
            setFormData({ ...formData, tags: e.target.value })
          }
          placeholder="Adult, Visual Novel, Romance"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">URL da Imagem</Label>
        <Input
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) =>
            setFormData({ ...formData, imageUrl: e.target.value })
          }
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="downloadUrl">URL de Download Geral</Label>
          <Input
            id="downloadUrl"
            value={formData.downloadUrl}
            onChange={(e) =>
              setFormData({ ...formData, downloadUrl: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="downloadUrlWindows">URL de Download Windows</Label>
          <Input
            id="downloadUrlWindows"
            value={formData.downloadUrlWindows}
            onChange={(e) =>
              setFormData({ ...formData, downloadUrlWindows: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="downloadUrlAndroid">URL de Download Android</Label>
          <Input
            id="downloadUrlAndroid"
            value={formData.downloadUrlAndroid}
            onChange={(e) =>
              setFormData({ ...formData, downloadUrlAndroid: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="downloadUrlLinux">URL de Download Linux</Label>
          <Input
            id="downloadUrlLinux"
            value={formData.downloadUrlLinux}
            onChange={(e) =>
              setFormData({ ...formData, downloadUrlLinux: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="downloadUrlMac">URL de Download Mac</Label>
          <Input
            id="downloadUrlMac"
            value={formData.downloadUrlMac}
            onChange={(e) =>
              setFormData({ ...formData, downloadUrlMac: e.target.value })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="installation">Instruções de Instalação</Label>
        <Textarea
          id="installation"
          value={formData.installation}
          onChange={(e) =>
            setFormData({ ...formData, installation: e.target.value })
          }
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="changelog">Changelog</Label>
        <Textarea
          id="changelog"
          value={formData.changelog}
          onChange={(e) =>
            setFormData({ ...formData, changelog: e.target.value })
          }
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="devNotes">Notas do Desenvolvedor</Label>
        <Textarea
          id="devNotes"
          value={formData.devNotes}
          onChange={(e) =>
            setFormData({ ...formData, devNotes: e.target.value })
          }
          rows={3}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="censored"
          checked={formData.censored}
          onChange={(e) =>
            setFormData({ ...formData, censored: e.target.checked })
          }
        />
        <Label htmlFor="censored">Censurado</Label>
      </div>

      <div className="space-y-4">
        <Label>Suporte a Sistemas Operacionais</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="osWindows"
              checked={formData.osWindows}
              onChange={(e) =>
                setFormData({ ...formData, osWindows: e.target.checked })
              }
            />
            <Label htmlFor="osWindows">Windows</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="osAndroid"
              checked={formData.osAndroid}
              onChange={(e) =>
                setFormData({ ...formData, osAndroid: e.target.checked })
              }
            />
            <Label htmlFor="osAndroid">Android</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="osLinux"
              checked={formData.osLinux}
              onChange={(e) =>
                setFormData({ ...formData, osLinux: e.target.checked })
              }
            />
            <Label htmlFor="osLinux">Linux</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="osMac"
              checked={formData.osMac}
              onChange={(e) =>
                setFormData({ ...formData, osMac: e.target.checked })
              }
            />
            <Label htmlFor="osMac">Mac</Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {game ? "Atualizar" : "Criar"} Jogo
        </Button>
      </div>
    </form>
  );
}

function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: gamesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["games", currentPage, searchTerm],
    queryFn: () => apiClient.listGames({ page: currentPage, search: searchTerm }),
  });

  const createGameMutation = useMutation({
    mutationFn: apiClient.createGame,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
      setShowCreateForm(false);
      toast({
        title: "Sucesso",
        description: "Jogo criado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar jogo",
        variant: "destructive",
      });
    },
  });

  const handleCreateGame = (data: any) => {
    createGameMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          Erro ao carregar jogos: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Jogos</h1>
          <p className="text-muted-foreground">
            Descubra e jogue os melhores jogos
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Jogo
        </Button>
      </div>

      {showCreateForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Criar Novo Jogo</CardTitle>
          </CardHeader>
          <CardContent>
            <GameForm
              onSubmit={handleCreateGame}
              onCancel={() => setShowCreateForm(false)}
            />
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar jogos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {gamesData?.games.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum jogo encontrado.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {gamesData?.games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>

          {gamesData?.pagination.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={gamesData.pagination.totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
}

function GameDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: game,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["game", id],
    queryFn: () => apiClient.getGame({ id: id! }),
    enabled: !!id,
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: (gameId: string) =>
      game?.isFavorited
        ? apiClient.removeFromFavorites({ gameId })
        : apiClient.addToFavorites({ gameId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["game", id] });
      toast({
        title: "Sucesso",
        description: game?.isFavorited
          ? "Removido dos favoritos"
          : "Adicionado aos favoritos",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          Erro ao carregar jogo: {error?.message || "Jogo não encontrado"}
        </div>
      </div>
    );
  }

  const tags = game.tags.split(",").map((tag: string) => tag.trim());

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-6">
            <img
              src={game.imageUrl}
              alt={game.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{game.title}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span>por {game.developer}</span>
                <span>•</span>
                <span>v{game.version}</span>
                <span>•</span>
                <span>{game.engine}</span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Descrição</h2>
              <p className="text-muted-foreground">{game.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {game.installation && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Instalação</h2>
                <p className="text-muted-foreground">{game.installation}</p>
              </div>
            )}

            {game.changelog && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Changelog</h2>
                <p className="text-muted-foreground">{game.changelog}</p>
              </div>
            )}

            {game.devNotes && (
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Notas do Desenvolvedor
                </h2>
                <p className="text-muted-foreground">{game.devNotes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avaliação</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span>{game.rating}/5</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Idioma</span>
                <span>{game.language}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data de Lançamento</span>
                <span>
                  {new Date(game.releaseDate).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Downloads</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {game.downloadUrl && (
                <Button className="w-full" asChild>
                  <a href={game.downloadUrl} target="_blank" rel="noopener">
                    <Download className="h-4 w-4 mr-2" />
                    Download Geral
                  </a>
                </Button>
              )}
              {game.downloadUrlWindows && (
                <Button className="w-full" variant="outline" asChild>
                  <a
                    href={game.downloadUrlWindows}
                    target="_blank"
                    rel="noopener"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Windows
                  </a>
                </Button>
              )}
              {game.downloadUrlAndroid && (
                <Button className="w-full" variant="outline" asChild>
                  <a
                    href={game.downloadUrlAndroid}
                    target="_blank"
                    rel="noopener"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Android
                  </a>
                </Button>
              )}
              {game.downloadUrlLinux && (
                <Button className="w-full" variant="outline" asChild>
                  <a
                    href={game.downloadUrlLinux}
                    target="_blank"
                    rel="noopener"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Linux
                  </a>
                </Button>
              )}
              {game.downloadUrlMac && (
                <Button className="w-full" variant="outline" asChild>
                  <a href={game.downloadUrlMac} target="_blank" rel="noopener">
                    <Download className="h-4 w-4 mr-2" />
                    Mac
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>

          <Button
            className="w-full"
            variant={game.isFavorited ? "default" : "outline"}
            onClick={() => toggleFavoriteMutation.mutate(game.id)}
          >
            <Heart
              className={`h-4 w-4 mr-2 ${
                game.isFavorited ? "fill-current" : ""
              }`}
            />
            {game.isFavorited ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ImageManager({
  gameId,
  gameName,
}: {
  gameId: string;
  gameName: string;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: images,
    isLoading,
  } = useQuery({
    queryKey: ["game-images", gameId],
    queryFn: () => apiClient.getGameImages({ gameId }),
  });

  const uploadMutation = useMutation({
    mutationFn: apiClient.uploadGameImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["game-images", gameId] });
      setSelectedFile(null);
      setIsUploading(false);
      toast({
        title: "Sucesso",
        description: "Imagem enviada com sucesso!",
      });
    },
    onError: (error) => {
      setIsUploading(false);
      toast({
        title: "Erro",
        description: error.message || "Erro ao enviar imagem",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: apiClient.deleteGameImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["game-images", gameId] });
      toast({
        title: "Sucesso",
        description: "Imagem removida com sucesso!",
      });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const base64 = await encodeFileAsBase64DataURL(selectedFile);
      uploadMutation.mutate({
        gameId,
        base64,
        fileName: selectedFile.name,
      });
    } catch (error) {
      setIsUploading(false);
      toast({
        title: "Erro",
        description: "Erro ao processar arquivo",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Imagens - {gameName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="flex-1"
          />
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? (
              "Enviando..."
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Enviar
              </>
            )}
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-4">Carregando imagens...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images?.map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.imageUrl}
                  alt="Game screenshot"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => deleteMutation.mutate({ id: image.id })}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: gamesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-games", currentPage, searchTerm],
    queryFn: () => apiClient.listGames({ page: currentPage, search: searchTerm }),
  });

  const updateGameMutation = useMutation({
    mutationFn: apiClient.updateGame,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-games"] });
      queryClient.invalidateQueries({ queryKey: ["games"] });
      setEditingGame(null);
      toast({
        title: "Sucesso",
        description: "Jogo atualizado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar jogo",
        variant: "destructive",
      });
    },
  });

  const deleteGameMutation = useMutation({
    mutationFn: apiClient.deleteGame,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-games"] });
      queryClient.invalidateQueries({ queryKey: ["games"] });
      toast({
        title: "Sucesso",
        description: "Jogo removido com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao remover jogo",
        variant: "destructive",
      });
    },
  });

  const handleUpdateGame = (data: any) => {
    if (editingGame) {
      updateGameMutation.mutate({ id: editingGame.id, ...data });
    }
  };

  const handleDeleteGame = (gameId: string) => {
    if (confirm("Tem certeza que deseja remover este jogo?")) {
      deleteGameMutation.mutate({ id: gameId });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          Erro ao carregar jogos: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <p className="text-muted-foreground">
          Gerencie todos os jogos da plataforma
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar jogos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {gamesData?.games.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum jogo encontrado.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gamesData?.games.map((game) => (
              <Card key={game.id} className="overflow-hidden">
                <div className="admin-game-card-image">
                  <img
                    src={game.imageUrl}
                    alt={game.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-2">
                    {game.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="secondary">{game.engine}</Badge>
                    <span>{game.version}</span>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                    {game.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(game.releaseDate).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingGame(game)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteGame(game.id)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Remover
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {gamesData?.pagination.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={gamesData.pagination.totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      {editingGame && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Editar Jogo - {editingGame.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <GameForm
                game={editingGame}
                onSubmit={handleUpdateGame}
                onCancel={() => setEditingGame(null)}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function Navigation() {
  const [isDark, setIsDark] = useState(false);
  const { auth, adminStatus } = useAuth();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    const shouldUseDark =
      savedTheme === "dark" || (!savedTheme && systemPrefersDark);

    setIsDark(shouldUseDark);

    if (shouldUseDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold">
            Renx-Play
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost">
                <Home className="h-4 w-4 mr-2" />
                Games
              </Button>
            </Link>
            {adminStatus?.isAdmin && (
              <Link to="/admin">
                <Button variant="ghost">
                  <Settings className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </Link>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-4 w-4" />
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={toggleTheme}>
                  {isDark ? (
                    <Sun className="h-4 w-4 mr-2" />
                  ) : (
                    <Moon className="h-4 w-4 mr-2" />
                  )}
                  {isDark ? "Tema Claro" : "Tema Escuro"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {auth.status === "unauthenticated" && (
              <Button onClick={() => auth.signIn()} variant="outline">
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game/:id" element={<GameDetailPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}